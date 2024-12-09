from flask import Blueprint, request, jsonify
from functools import wraps
import mysql.connector
from backend.database.db import get_db_connection
from backend.auth import token_required
from sqlalchemy import func
from backend.models import db, User, Post, Friendship

boolDebug = False

# Define the blueprint for the profile
profile_blueprint = Blueprint('profile', __name__)

@profile_blueprint.route('/profile', methods=['GET'])
@token_required
def profile(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Total posts by the user
        cursor.execute("SELECT COUNT(*) FROM post WHERE user_id = %s", (user_id,))
        total_posts = cursor.fetchone()[0]

        # Total followers (where other users follow the logged-in user)
        cursor.execute("SELECT COUNT(*) FROM friendship WHERE user_id_2 = %s AND status = 1", (user_id,))
        total_followers = cursor.fetchone()[0]

        # Total following (where the logged-in user follows other users)
        cursor.execute("SELECT COUNT(*) FROM friendship WHERE user_id_1 = %s AND status = 1", (user_id,))
        total_following = cursor.fetchone()[0]

        # Total friends (mutual following relationship with distinct pairs)
        cursor.execute("""
            SELECT COUNT(DISTINCT LEAST(f1.user_id_1, f1.user_id_2), GREATEST(f1.user_id_1, f1.user_id_2)) 
            FROM friendship f1
            JOIN friendship f2 ON f1.user_id_1 = f2.user_id_2 AND f1.user_id_2 = f2.user_id_1
            WHERE f1.user_id_1 = %s AND f1.status = 1 AND f2.status = 1
        """, (user_id,))
        total_friends = cursor.fetchone()[0]

        # Fetch posts by the user with their post IDs
        cursor.execute("""
            SELECT post_id, content, created_at 
            FROM post 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (user_id,))
        posts = cursor.fetchall()

        # Format posts for JSON response
        post_list = [
            {"post_id": post[0], "content": post[1], "created_at": post[2]}
            for post in posts
        ]

        cursor.close()
        connection.close()

        # Return the calculated profile data along with posts
        return jsonify({
            "username": username,
            "total_posts": total_posts,
            "total_followers": total_followers,
            "total_following": total_following,
            "total_friends": total_friends,
            "posts": post_list
        }), 200

    except mysql.connector.Error as err:
        print(f"Error fetching profile: {err}")
        return "Error loading profile", 500

    
@profile_blueprint.route('/profile/posts', methods=['GET'])
@token_required
def get_user_posts(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Fetch posts for the logged-in user
        query = "SELECT content, created_at FROM post WHERE user_id = %s ORDER BY created_at DESC"
        cursor.execute(query, (user_id,))
        posts = cursor.fetchall()

        cursor.close()
        connection.close()

        # Return posts in JSON format
        return jsonify(posts), 200

    except mysql.connector.Error as err:
        print(f"Error fetching user posts: {err}")
        return jsonify({"error": "Error loading posts"}), 500

@profile_blueprint.route('/profile/friends', methods=['GET'])
@token_required
def get_user_friends(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Query to find mutual friends with usernames
        query = """
            SELECT u.user_id, u.username
            FROM friendship f1
            JOIN friendship f2 ON f1.user_id_1 = f2.user_id_2 AND f1.user_id_2 = f2.user_id_1
            JOIN user u ON u.user_id = f1.user_id_2
            WHERE f1.user_id_1 = %s AND f1.status = 1 AND f2.status = 1
        """
        cursor.execute(query, (user_id,))
        friends = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(friends), 200

    except mysql.connector.Error as err:
        print(f"Error fetching friends: {err}")
        return jsonify({"error": "Error loading friends"}), 500
    
@profile_blueprint.route('/profile/followers-following', methods=['GET'])
@token_required
def get_followers_and_following(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Fetch followers
        query = """
            SELECT u.user_id, u.username
            FROM friendship f
            JOIN user u ON f.user_id_1 = u.user_id
            WHERE f.user_id_2 = %s AND f.status = 1
        """
        cursor.execute(query, (user_id,))
        followers = cursor.fetchall()

        # Fetch following
        query = """
            SELECT u.user_id, u.username
            FROM friendship f
            JOIN user u ON f.user_id_2 = u.user_id
            WHERE f.user_id_1 = %s AND f.status = 1
        """
        cursor.execute(query, (user_id,))
        following = cursor.fetchall()

        # Combine followers and following lists without duplicates
        all_users = {user['user_id']: user for user in followers + following}
        unique_users = list(all_users.values())

        cursor.close()
        connection.close()

        return jsonify(unique_users), 200

    except mysql.connector.Error as err:
        print(f"Error fetching followers and following: {err}")
        return jsonify({"error": "Error loading followers and following"}), 500
