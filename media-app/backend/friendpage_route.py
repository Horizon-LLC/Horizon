from flask import Blueprint, request, jsonify, session
from flask_login import current_user, login_required
import jwt
from functools import wraps
from backend.database.db import get_db_connection
import mysql.connector

# Define the blueprint for friends
friend_blueprint = Blueprint('friend', __name__)

# Create a POST route to create friends
@friend_blueprint.route('/add-friend', methods=['POST'])
def add_friend():
    print(session.get('user_id'))
    data = request.get_json()
    
    # Validate request data
    if not data or 'userId' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    user_id_1 = session.get('user_id')  # Get current user's ID
    user_id_2 = data['userId']  # Get friend's user ID from the request

    # Debugging: Print user IDs to check if they're None
    print(f'user_id_1: {user_id_1}, user_id_2: {user_id_2}')

    if user_id_1 is None or user_id_2 is None:
        return jsonify({'error': 'User IDs cannot be None'}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Use parameterized query to prevent SQL injection
            sql_query = "INSERT INTO friendship (user_id_1, user_id_2, status) VALUES (%s, %s, %s)"
            cursor.execute(sql_query, (user_id_1, user_id_2, 1))
            connection.commit()

        return jsonify({'message': 'Friendship created successfully!'}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to create friendship'}), 500

    finally:
        connection.close()

# Create a GET route to get all friends
@friend_blueprint.route('/get-friends', methods=['GET'])
def get_friends():
    print(f"Session contents: {session}")  # Debug statement
    user_id = session.get('user_id')  # Get current user's ID

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Query to get all friends where user is either user_id_1 or user_id_2
            sql_query = """
                SELECT u.user_id, u.username 
                FROM friendships f
                JOIN users u ON (f.user_id_1 = u.user_id OR f.user_id_2 = u.user_id)
                WHERE (f.user_id_1 = %s OR f.user_id_2 = %s)
                AND u.user_id != %s
                AND f.status = 1
            """
            cursor.execute(sql_query, (user_id, user_id, user_id))
            friends = cursor.fetchall()

        if not friends:
            print("User has no friends")
        return jsonify(friends)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to retrieve friends'})

    finally:
        connection.close()