from flask import Blueprint, request, jsonify
import mysql.connector
from backend.database.db import get_db_connection

# Initialize the blueprint
community_blueprint = Blueprint('community', __name__)

# Route to get all communities
@community_blueprint.route('/get-communities', methods=['GET', 'OPTIONS'])
def get_communities():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # Query to fetch all communities
        cursor.execute("SELECT id, name, description FROM community")
        communities = cursor.fetchall()

        # Return the communities in the response
        return jsonify([{"id": c[0], "name": c[1], "description": c[2]} for c in communities])

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# Route to create a new community
@community_blueprint.route('/create-community', methods=['POST', 'OPTIONS'])
def create_community():
    data = request.json
    name = data.get('name')
    description = data.get('description')

    if not name or not description:
        return jsonify({"error": "Name and description are required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Insert new community into the database
        query = """
            INSERT INTO community (name, description)
            VALUES (%s, %s)
        """
        cursor.execute(query, (name, description))
        connection.commit()

        # Get the newly created community's ID
        new_community_id = cursor.lastrowid

        return jsonify({
            "id": new_community_id,
            "name": name,
            "description": description
        }), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()
