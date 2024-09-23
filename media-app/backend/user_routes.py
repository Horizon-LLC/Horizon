# user_routes.py
# This file handles:
# 1. Create user

from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
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
    password = generate_password_hash(data.get('password'))  # Hash the password
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
        print(f"Error occurred: {err}")  # Log the error message in the terminal
        return jsonify({'error': str(err)}), 500
