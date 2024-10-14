from flask import Blueprint, request, jsonify
import jwt
from functools import wraps
from backend.database.db import get_db_connection
import mysql.connector


boolDebug = True
SECRET_KEY = 'HORIZON'

# Define the blueprint for the profile
profile_blueprint = Blueprint('profile', __name__)

# Utility function to verify JWT token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # JWT is passed in the request headers
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = data['user_id']
            username = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(user_id, username, *args, **kwargs)

    return decorated

@profile_blueprint.route('/profile', methods=['GET'])
@token_required
def profile(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Fetch total number of posts for the logged-in user
        query_posts = "SELECT COUNT(*) FROM post WHERE user_id = %s"
        cursor.execute(query_posts, (user_id,))
        total_posts = cursor.fetchone()[0]  # Fetch the first element from the result

        # Fetch total number of followers for the logged-in user
        query_followers = "SELECT COUNT(*) FROM friendship WHERE user_id_2 = %s AND status = 1"
        cursor.execute(query_followers, (user_id,))
        total_followers = cursor.fetchone()[0]  # Fetch the first element from the result

        # Fetch total number of following for the logged-in user
        query_following = "SELECT COUNT(*) FROM friendship WHERE user_id_1 = %s AND status = 1"
        cursor.execute(query_following, (user_id,))
        total_following = cursor.fetchone()[0]  # Fetch the first element from the result

        # Return the user's profile information along with total posts, followers, and following
        return jsonify({
            "username": username,
            "total_posts": total_posts,
            "total_followers": total_followers,
            "total_following": total_following
        }), 200
    except mysql.connector.Error as err:
        print(f"Error fetching profile: {err}")
        return "Error loading profile", 500