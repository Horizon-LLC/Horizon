from flask import Blueprint, request, jsonify
from functools import wraps
import mysql.connector
from backend.database.db import get_db_connection
from backend.auth import token_required
from sqlalchemy import func
from backend.models import db, User, Post, Friendship
from backend.upload_files import upload_to_s3

boolDebug = False

# Define the blueprint for the profile
profile_blueprint = Blueprint('profile', __name__)

@profile_blueprint.route('/profile', methods=['GET'])
@token_required
def profile(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT profile_pic, bio FROM user WHERE user_id = %s", (user_id,))
        user_data = cursor.fetchone()

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        cursor.execute("SELECT COUNT(*) AS total_posts FROM post WHERE user_id = %s", (user_id,))
        total_posts = cursor.fetchone()['total_posts']

        cursor.execute("SELECT COUNT(*) AS total_followers FROM friendship WHERE user_id_2 = %s AND status = 1", (user_id,))
        total_followers = cursor.fetchone()['total_followers']

        cursor.execute("SELECT COUNT(*) AS total_following FROM friendship WHERE user_id_1 = %s AND status = 1", (user_id,))
        total_following = cursor.fetchone()['total_following']

        cursor.execute("""
            SELECT COUNT(DISTINCT LEAST(f1.user_id_1, f1.user_id_2), GREATEST(f1.user_id_1, f1.user_id_2)) AS total_friends
            FROM friendship f1
            JOIN friendship f2 ON f1.user_id_1 = f2.user_id_2 AND f1.user_id_2 = f2.user_id_1
            WHERE f1.user_id_1 = %s AND f1.status = 1 AND f2.status = 1
        """, (user_id,))
        total_friends = cursor.fetchone()['total_friends']

        cursor.close()
        connection.close()

        return jsonify({
            "username": username,
            "profile_pic": user_data.get("profile_pic"),
            "bio": user_data.get("bio"),  # Add bio here
            "total_posts": total_posts,
            "total_followers": total_followers,
            "total_following": total_following,
            "total_friends": total_friends
        }), 200

    except mysql.connector.Error as err:
        return jsonify({"error": "Error loading profile"}), 500


    
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


@profile_blueprint.route('/upload-profile-pic', methods=['POST'])
@token_required
def upload_profile_pic(user_id, username):
    if 'file' not in request.files:
        print("No file found in request")  # Log missing file
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        print("Empty filename")  # Log empty file
        return jsonify({"error": "File is empty"}), 400

    # Log file details
    print(f"File received: {file.filename}, User ID: {user_id}")

    # Generate a unique filename
    filename = f"profile_pictures/{user_id}_{file.filename}"

    # Upload to S3
    file_url = upload_to_s3(file, filename)
    if not file_url:
        print("Failed to upload to S3")  # Log S3 upload failure
        return jsonify({"error": "Failed to upload profile picture"}), 500

    # Update the database
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE user SET profile_pic = %s WHERE user_id = %s",
            (file_url, user_id)
        )
        connection.commit()
        cursor.close()
        connection.close()

        print(f"Database updated for User ID {user_id}, URL: {file_url}")  # Log database update
        return jsonify({"message": "Profile picture updated", "profile_pic_url": file_url}), 200
    except Exception as e:
        print(f"Database error: {e}")  # Log database error
        return jsonify({"error": "Failed to update database"}), 500
    

@profile_blueprint.route('/profile/followers', methods=['GET'])
@token_required
def get_followers(user_id, username):
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

        cursor.close()
        connection.close()

        return jsonify(followers), 200

    except mysql.connector.Error as err:
        print(f"Error fetching followers: {err}")
        return jsonify({"error": "Error loading followers"}), 500
    
@profile_blueprint.route('/profile/following', methods=['GET'])
@token_required
def get_following(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Fetch following
        query = """
            SELECT u.user_id, u.username
            FROM friendship f
            JOIN user u ON f.user_id_2 = u.user_id
            WHERE f.user_id_1 = %s AND f.status = 1
        """
        cursor.execute(query, (user_id,))
        following = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(following), 200

    except mysql.connector.Error as err:
        print(f"Error fetching following: {err}")
        return jsonify({"error": "Error loading following"}), 500
    
