from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from backend.database.db import get_db_connection
import mysql.connector

SECRET_KEY = 'HORIZON'  # Ensure this matches your JWT secret

# Define the blueprint for friends
friend_blueprint = Blueprint('friend', __name__)

# Reuse the token_required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = data['user_id']
            username = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(user_id, username, *args, **kwargs)
    return decorated

@friend_blueprint.route('/add-friend', methods=['POST'])
@token_required
def add_friend(user_id, username):
    data = request.get_json()
    if not data or 'userId' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    user_id_2 = data['userId']  # Get friend's user ID from the request

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql_query = "INSERT INTO friendship (user_id_1, user_id_2, status) VALUES (%s, %s, %s)"
            cursor.execute(sql_query, (user_id, user_id_2, 1))  # Use user_id from token
            connection.commit()

        return jsonify({'message': 'Friendship created successfully!'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to create friendship: ' + str(e)}), 500

    finally:
        connection.close()


@friend_blueprint.route('/get-friends', methods=['GET'])
@token_required
def get_friends(user_id, username):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Query to get mutual friendships and their usernames
            sql_query = """
                SELECT u.user_id, u.username
                FROM friendship f
                JOIN user u ON f.user_id_2 = u.user_id
                WHERE f.user_id_1 = %s AND f.status = 1
                AND EXISTS (
                    SELECT 1 FROM friendship f2
                    WHERE f2.user_id_1 = f.user_id_2 AND f2.user_id_2 = %s AND f2.status = 1
                )
            """
            cursor.execute(sql_query, (user_id, user_id))
            friends = cursor.fetchall()

            # Calculate total friends
            total_friends = len(friends)

        if total_friends == 0:
            return jsonify({"message": "User has no friends", "total_friends": 0}), 200

        # Extract user IDs and usernames of friends
        friends_list = [{"user_id": friend[0], "username": friend[1]} for friend in friends]

        return jsonify({"friends": friends_list, "total_friends": total_friends}), 200

    except mysql.connector.Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to retrieve friends'}), 500

    finally:
        connection.close()