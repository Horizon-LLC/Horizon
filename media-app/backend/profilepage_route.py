from flask import Blueprint, request, jsonify
from auth import token_required
from functools import wraps
from database.db import get_db_connection
import mysql.connector


boolDebug = False


# Define the blueprint for the profile
profile_blueprint = Blueprint('profile', __name__)


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