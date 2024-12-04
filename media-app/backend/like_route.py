from flask import Blueprint, request, jsonify
from backend.auth import token_required
from backend.database.db import get_db_connection
import mysql.connector

boolDebug = False

# Define the blueprint for the like routes
like_blueprint = Blueprint('like', __name__)

# Check if a user liked a post
@like_blueprint.route('/is-liked', methods=['GET'])
@token_required
def is_liked(user_id, username):
    post_id = request.args.get('post_id')

    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT COUNT(*) FROM `like` WHERE user_id = %s AND post_id = %s"
        cursor.execute(query, (user_id, post_id))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({"isLiked": result[0] > 0}), 200
    except mysql.connector.Error as err:
        print(f"Error checking like: {err}")
        return jsonify({"error": "Error checking like"}), 500

# Create a new like
@like_blueprint.route('/create-like', methods=['POST'])
@token_required
def create_like(user_id, username):
    data = request.get_json()
    post_id = data.get('post_id')

    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "INSERT INTO `like` (user_id, post_id) VALUES (%s, %s)"
        cursor.execute(query, (user_id, post_id))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Like created successfully"}), 201
    except mysql.connector.Error as err:
        print(f"Error creating like: {err}")
        return jsonify({"error": "Error creating like"}), 500

# Get total likes for a post
@like_blueprint.route('/total-likes', methods=['GET'])
def get_total_likes():
    post_id = request.args.get('post_id')

    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT COUNT(*) FROM `like` WHERE post_id = %s"
        cursor.execute(query, (post_id,))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({"totalLikes": result[0]}), 200
    except mysql.connector.Error as err:
        print(f"Error fetching total likes: {err}")
        return jsonify({"error": "Error fetching total likes"}), 500

# Delete a like
@like_blueprint.route('/delete-like', methods=['DELETE'])
@token_required
def delete_like(user_id, username):
    data = request.get_json()
    post_id = data.get('post_id')

    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "DELETE FROM `like` WHERE user_id = %s AND post_id = %s"
        cursor.execute(query, (user_id, post_id))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Like deleted successfully"}), 200
    except mysql.connector.Error as err:
        print(f"Error deleting like: {err}")
        return jsonify({"error": "Error deleting like"}), 500
