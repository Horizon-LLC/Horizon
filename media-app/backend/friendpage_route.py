from flask import Blueprint, request, jsonify
from backend.auth import token_required
from backend.database.db import get_db_connection
import mysql.connector

friend_blueprint = Blueprint('friend', __name__)

@friend_blueprint.route('/add-friend', methods=['POST'])
@token_required
def add_friend(user_id, username):
    """
    Adds a friend (follower) to the database.
    """
    data = request.get_json()
    if not data or 'userId' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    friend_id = data['userId']

    connection = None
    try:
        print("Debug: Establishing database connection")
        connection = get_db_connection()
        print("Debug: Connection established")

        with connection.cursor() as cursor:
            sql_query = "INSERT INTO friendship (user_id_1, user_id_2, status) VALUES (%s, %s, %s)"
            print(f"Debug: Executing query: {sql_query}")
            cursor.execute(sql_query, (user_id, friend_id, 1))
            connection.commit()
            print("Debug: Query executed successfully")

        return jsonify({'message': 'Friendship created successfully!'}), 200

    except mysql.connector.Error as db_err:
        print(f"Debug: Database error - {str(db_err)}")
        return jsonify({'error': f'Database error: {str(db_err)}'}), 500
    except Exception as e:
        print(f"Debug: Unexpected error - {str(e)}")
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    finally:
        if connection:
            try:
                connection.close()
                print("Debug: Connection closed")
            except Exception as close_err:
                print(f"Debug: Error closing connection - {str(close_err)}")





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