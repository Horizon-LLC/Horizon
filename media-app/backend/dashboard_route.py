from flask import Blueprint, session, request, jsonify, render_template
import mysql.connector
from functools import wraps
from graphviz import render
from backend.database.db import get_db_connection
from backend.auth import token_required
from backend.user_routes import fetch_username_by_user_id
from backend.upload_files import upload_to_s3


boolDebug = False

# SECRET_KEY = 'HORIZON'

#Define the blueprint for the dashboard
dashboard_blueprint = Blueprint('dashboard', __name__)


# Fetch all users' post
@dashboard_blueprint.route('/dashboard', methods=['GET'])
@token_required
def dashboard(user_id, username):
    try:
        limit = int(request.args.get('limit', 7))  # Default to 7 posts per page
        offset = int(request.args.get('offset', 0))  # Default to the first page
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT post.post_id, post.user_id, post.content, post.pic_link,
                   COALESCE(post.created_at, NOW()) AS created_at
            FROM post
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        cursor.execute(query, (limit, offset))
        posts = cursor.fetchall()

        for post in posts:
            post["username"] = fetch_username_by_user_id(post["user_id"])

        cursor.close()
        connection.close()
        return jsonify({"posts": posts}), 200
    except mysql.connector.Error as err:
        print(f"Error fetching posts: {err}")
        return jsonify({"error": "Failed to fetch posts"}), 500


@dashboard_blueprint.route('/dashboard/following', methods=['GET'])
@token_required
def dashboard_following(user_id, username):
    try:
        limit = int(request.args.get('limit', 7))  # Default to 7 posts per page
        offset = int(request.args.get('offset', 0))  # Default to the first page
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT post.post_id, post.user_id, post.content, post.pic_link,
                   COALESCE(post.created_at, NOW()) AS created_at
            FROM post
            WHERE user_id IN (
                SELECT user_id_2
                FROM friendship
                WHERE user_id_1 = %s AND status = 1
            )
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        cursor.execute(query, (user_id, limit, offset))
        posts = cursor.fetchall()

        for post in posts:
            post["username"] = fetch_username_by_user_id(post["user_id"])

        cursor.close()
        connection.close()
        return jsonify({"posts": posts}), 200
    except mysql.connector.Error as err:
        print(f"Error fetching following posts: {err}")
        return jsonify({"error": "Failed to fetch posts"}), 500





# Create post route, protected with JWT
@dashboard_blueprint.route('/create-post', methods=['POST'])
@token_required
def create_post(user_id, username):
    if boolDebug:
        print("Create post route hit!")  # Add this at the beginning to check if the route is accessed

    content = request.form.get('content')  # Fetch content from form data
    created_at = request.form.get('created_at')  # Fetch created_at from form data
    file = request.files.get('file')  # Check for an attached file

    pic_link = None
    if file:
        filename = f"post_media/{user_id}_{file.filename}"
        pic_link = upload_to_s3(file, filename)
        if not pic_link:
            return jsonify({"error": "Failed to upload media file"}), 500

    if not content:
        return jsonify({"error": "Post content cannot be empty"}), 400

    # Default `created_at` to the current timestamp if not provided
    if not created_at:
        from datetime import datetime
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO post (content, created_at, user_id, pic_link)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (content, created_at, user_id, pic_link))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Post created successfully",
            "post_content": content,
            "pic_link": pic_link,
            "created_at": created_at
        }), 201
    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return jsonify({"error": f"Failed to create post: {err}"}), 500



# Edit post route (placeholder), protected with JWT
@dashboard_blueprint.route('/edit-post', methods=['PUT'])
@token_required
def edit_post(user_id, username):
    """
    Placeholder function for editing a post.
    """
    data = request.get_json()
    post_id = data.get('post_id')
    new_content = data.get('content')

    if not post_id or not new_content:
        return jsonify({"error": "Post ID and new content are required"}), 400

    # Placeholder response indicating the function is not yet implemented
    return jsonify({"message": "Edit post functionality is not implemented yet"}), 501


# Delete post route (placeholder), protected with JWT
@dashboard_blueprint.route('/delete-post', methods=['DELETE'])
@token_required
def delete_post(user_id, username):
    """
    Placeholder function for deleting a post.
    """
    data = request.get_json()
    post_id = data.get('post_id')

    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    # Placeholder response indicating the function is not yet implemented
    return jsonify({"message": "Delete post functionality is not implemented yet"}), 501

