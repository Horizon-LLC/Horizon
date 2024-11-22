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
        # Fetch user details
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Total posts
        total_posts = db.session.query(func.count(Post.post_id)).filter_by(user_id=user_id).scalar()

        # Total followers
        total_followers = db.session.query(func.count(Friendship.friendship_id)).filter(
            Friendship.user_id_2 == user_id,
            Friendship.status.is_(True)
        ).scalar()

        # Total following
        total_following = db.session.query(func.count(Friendship.friendship_id)).filter(
            Friendship.user_id_1 == user_id,
            Friendship.status.is_(True)
        ).scalar()

        # Total friends (mutual friendships)
        total_friends = db.session.query(func.count(Friendship.friendship_id)).filter(
            Friendship.user_id_1 == user_id,
            Friendship.status.is_(True),
            db.session.query(Friendship).filter(
                Friendship.user_id_2 == user_id,
                Friendship.user_id_1 == Friendship.user_id_2,
                Friendship.status.is_(True)
            ).exists()
        ).scalar()

        # Return the profile data
        return jsonify({
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profile_pic": user.profile_pic,
            "total_posts": total_posts,
            "total_followers": total_followers,
            "total_following": total_following,
            "total_friends": total_friends
        }), 200

    except Exception as e:
        print(f"Error in /profile: {e}")
        return jsonify({"error": "Something went wrong"}), 500
    
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
