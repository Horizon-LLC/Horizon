# user_routes.py
# This file handles:
# 1. Create user
# 2. Login authentication
# 3. Search user

from flask import Blueprint, jsonify, request, session, render_template, Response
# from werkzeug.security import generate_password_hash, check_password_hash
import jwt # Generate a token for user authentication
import datetime
from typing import List, Dict, Optional, Union, Tuple
import mysql.connector
from backend.database.db import get_db_connection

# Use a secure secret key for JWT encoding
SECRET_KEY = 'HORIZON'

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

    # Check if any required fields are blank
    required_fields = {
        "first_name": first_name,
        "last_name": last_name,
        "username": username,
        "email": email,
        "date_of_birth": date_of_birth,
        "password": password,
        "security_question": security_question,
        "security_answer": security_answer,
    }

    missing_fields = [field for field, value in required_fields.items() if not value]
    if missing_fields:
        return jsonify({
            'error': 'One or more blank fields'
        }), 400
    
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
            # Create JWT token
            token = jwt.encode({
                'user_id': user[0],
                'username': user[1],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=72) # Token expiration
            }, SECRET_KEY, algorithm='HS256')
            return jsonify({'token': token, 'username': user[1], 'user_id': user[0]}), 200
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


# Route to fetch all users with only username and user_id
@user_blueprint.route('/users', methods=['GET'])
def get_all_users_light():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)  # Use dictionary=True to return results as a dictionary

        # Fetch all users with only their username and user_id
        query = "SELECT user_id, username FROM user"
        cursor.execute(query)
        users = cursor.fetchall()


        cursor.close()
        connection.close()

        return jsonify(users), 200
    except mysql.connector.Error as err:
        print(f"Error fetching users: {err}")
        return jsonify({'error': str(err)}), 500

# Route to fetch a single user's details by user_id
@user_blueprint.route('/user/<int:user_id>', methods=['GET'])
def get_single_user(user_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)  # Use dictionary=True to return results as a dictionary

        # Fetch the user details by user_id
        query = "SELECT user_id, first_name, last_name, username, email, date_of_birth, is_verified FROM user WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if user:
            return jsonify(user), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except mysql.connector.Error as err:
        print(f"Error fetching user: {err}")
        return jsonify({'error': str(err)}), 500