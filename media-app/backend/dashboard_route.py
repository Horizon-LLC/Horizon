from flask import Blueprint, session, request, jsonify, render_template
import mysql.connector
from graphviz import render

from database.db import get_db_connection

boolDebug = True;

#Define the blueprint for the dashboard
dashboard_blueprint = Blueprint('dashboard', __name__)

# Dashboard route
@dashboard_blueprint.route('/dashboard')
def dashboard():
    if 'username' in session:
        username = session['username']
        user_id = session['user_id']

        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            #Fetch all posts for the logged-in user
            query = "SELECT content, created_at FROM post WHERE user_id = %s ORDER BY created_at DESC"
            cursor.execute(query, (user_id,))
            posts = cursor.fetchall()

            post_list = [{"content": post[0], "created_at": post[1]} for post in posts]

            if boolDebug:
                print(posts)  # Debugging step to check the structure of the fetched posts
            cursor.close()
            connection.close()

            #Render the dashboard template, passing the username and posts
            return jsonify({"username": username, "posts": post_list}), 200
        except mysql.connector.Error as err:
            print(f"Error fetching posts: {err}")
            return "Error loading dashboard", 500
    else:
        return "Please log in to access  the dashboard", 401

@dashboard_blueprint.route('/create-post', methods=['POST'])
def create_post():
    if boolDebug:
        print("Create post route hit!")  # Add this at the beginning to check if the route is accessed
    if 'username' not in session:
        return jsonify({"error": "Please log in  to create a post"})


    data = request.get_json()
    content = data.get('content')


    if not content:
        return jsonify({"error": "Post content cannot be empty"})

    try:
        #Insert the post into the database
        connection = get_db_connection()
        cursor = connection .cursor()

        if(boolDebug):
            print(f"Attempting to insert post content: {content} for user: {session['user_id']}")

        query = "INSERT INTO post (content, user_id) VALUES (%s, %s)"
        cursor.execute(query, (content, session['user_id']))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Post Created successfully", "post_content": content}), 201
    except mysql.connector.Error as err:
        if boolDebug:
            print(f"Database Error: {err}")  # Output error to your terminal for debugging
        return jsonify({"error": f"Failed to create post: {err}"}), 500

