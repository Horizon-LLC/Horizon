# user_routes.py
# This file handles:
# 1. Create user

from flask import Blueprint, jsonify, request, session, render_template, Response
from werkzeug.security import generate_password_hash, check_password_hash
from typing import List, Dict, Optional, Union, Tuple
import mysql.connector
from database.db import get_db_connection

# Define Blueprint
user_blueprint = Blueprint('user', __name__)

# Route to create a new user
@user_blueprint.route('/createUser', methods=['POST'])  # Added leading '/'
def create_user():
    data = request.json

    # Capture user data from the request
    first_name = data.get('first_name')
    last_name = data.get('last_name')  # Corrected this line
    username = data.get('username')
    email = data.get('email')
    date_of_birth = data.get('date_of_birth')
    password = data.get('password')  # No Hash the password
    security_question = data.get('security_question')
    security_answer = data.get('security_answer')
    is_verified = False  # Default to False until verification

    try:
        # Establish database connection
        connection = get_db_connection()
        cursor = connection.cursor()

        # Define the SQL query with placeholders
        query = """
        INSERT INTO user (first_name, last_name, profile_pic, username, email, date_of_birth, is_verified, password, location, security_question, security_answer)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Execute the query with placeholders for profile_pic and location
        cursor.execute(query, (
            first_name,
            last_name,
            '/images/default_profile_pic.jpg',  # Placeholder for profile_pic
            username,
            email,
            date_of_birth,
            is_verified,
            password,
            'Earth',  # Placeholder for location
            security_question,
            security_answer
        ))

        # Commit the transaction and close the connection
        connection.commit()
        cursor.close()
        connection.close()

        # Print success message to the backend terminal
        print(f"User {username} created successfully!")
        return jsonify({'message': 'User created successfully!'}), 201

    except mysql.connector.Error as err:
        # Handle any database errors
        print(f"Error occurred: {err}")  #
        return jsonify({'error': str(err)}), 500


#Route to serve the login form to test login functionality.
#Test user, email: fastfox@example.com,  password: password123
@user_blueprint.route('/login-form')
def login_form() ->str: # Display mock-login form
    return render_template('mock_login.html')

# Route to log in a user
@user_blueprint.route('/login', methods=['POST'])
def login_user()-> Union[Response, Tuple[Response, int]]:
    # Use get_json to parse JSON from the request
    data = request.get_json()

    email: str = data.get('email')
    password: str = data.get('password')

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT user_id, username, password FROM user WHERE email = %s"
        cursor.execute(query, (email,))

        user: Optional[Tuple[str,str]] = cursor.fetchone()

        cursor.close()
        connection.close()

        # Check if user exists and password matches
        if user and user[2] == password:
            session['username'] = user[1]
            session['user_id'] = user[0]
            return jsonify({'message': 'Login successful', 'username': user[1]}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except mysql.connector.Error as err:
       
        print(f"Error occurred: {err}")  
        return jsonify({'error': str(err)}), 500
    
# Add the logout route
@user_blueprint.route('/logout', methods=['POST'])
def logout() -> Response:
    session.pop('username', None)  # Clear the session
    return jsonify({'message': 'Logout successful'}), 200