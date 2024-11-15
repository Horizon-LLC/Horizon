from flask import Blueprint, session, request, jsonify, render_template
import mysql.connector
from functools import wraps
from graphviz import render
from backend.database.db import get_db_connection
from backend.auth import token_required

boolDebug = False

# SECRET_KEY = 'HORIZON'

#Define the blueprint for the dashboard
dashboard_blueprint = Blueprint('dashboard', __name__)


# Dashboard route
@dashboard_blueprint.route('/dashboard', methods=['GET'])
@token_required
def dashboard(user_id, username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        #Fetch all posts for the logged-in user
        query = "SELECT content, created_at FROM post WHERE user_id = %s ORDER BY created_at DESC"
        cursor.execute(query, (user_id,))
        posts = cursor.fetchall()

        post_list = [{"content": post[0], "created_at": post[1]} for post in posts]

        cursor.close()
        connection.close()

        #Render the dashboard template, passing the username and posts
        return jsonify({"username": username, "posts": post_list}), 200
    except mysql.connector.Error as err:
        print(f"Error fetching posts: {err}")
        return "Error loading dashboard", 500


# Create post route, protected with JWT
@dashboard_blueprint.route('/create-post', methods=['POST'])
@token_required
def create_post(user_id, username):
    if boolDebug:
        print("Create post route hit!")  # Add this at the beginning to check if the route is accessed

    data = request.get_json()
    content = data.get('content')
    created_at = data.get('created_at')


    if not content:
        return jsonify({"error": "Post content cannot be empty"})

    try:
        #Insert the post into the database
        connection = get_db_connection()
        cursor = connection .cursor()

        if(boolDebug):
            print(f"Attempting to insert post content: {content} for user: {user_id} created at: {created_at}")  # Use 'user_id' from the JWT token
        query = "INSERT INTO post (content, created_at, user_id) VALUES (%s, %s, %s)"
        cursor.execute(query, (content, created_at, user_id))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Post Created successfully", "post_content": content, "created_at": created_at}), 201
    except mysql.connector.Error as err:
        if boolDebug:
            print(f"Database Error: {err}")  # Output error to your terminal for debugging
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

