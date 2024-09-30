from urllib import request

from flask import Flask, jsonify, redirect, Response, render_template, session, url_for
from flask_cors import CORS
import mysql.connector
from typing import List, Dict, Optional, Union, Tuple
import os

from werkzeug.security import check_password_hash

# from graphviz import render

from database.db import get_db_connection
from database.test_routes import test_blueprint  # Import test blueprint
from user_routes import user_blueprint # Import the blueprint
from dashboard_route import dashboard_blueprint # Import the dashboard blueprint

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, supports_credentials=True)  # Enable Cross-Origin Resource Sharing (CORS)

# Register the user blueprint
app.register_blueprint(user_blueprint)
app.register_blueprint(test_blueprint)  # Register the test routes blueprint
app.register_blueprint(dashboard_blueprint)

# Route to test the database connection
@app.route('/test-db', methods=['GET'])
def test_db() -> str:
    """Test the connection to the database and return the database name."""
    try:
        connection = get_db_connection()
        if connection is None:
            return "Failed to connect to the database."
        cursor = connection.cursor()
        cursor.execute("SELECT DATABASE();")
        db_name: Optional[tuple] = cursor.fetchone()
        cursor.close()
        connection.close()

        if db_name:
            return f"Connected to database named '{db_name[0]}' successfully."
        else:
            return "No database selected"

    except mysql.connector.Error as err:
        return f"Error: {err}"

# Route to fetch all users from the 'user' table
@app.route('/allUsers', methods=['GET'])
def get_all_users() -> Response:
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({"error": "Failed to connect to the database."})
        # it returns the results in a dictionary format, making it easier to work with in your frontend.
        cursor = connection.cursor(dictionary=True)  # Get results as dictionary
        cursor.execute("SELECT * FROM user")  # Query user data
        users: List[Dict[str, str]] = cursor.fetchall()  # Fetch all user records
        cursor.close()
        connection.close()
        return jsonify(users)  # Return JSON response
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})

# The /api/<table_name> route allows for dynamic fetching from any table.
# It is a flexible way to handle multiple database tables with one endpoint.
@app.route('/api/<table_name>', methods=['GET'])
def get_table_data(table_name) -> Response:
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({"error": "Failed to connect to the database."})
        query = f"SELECT * FROM `{table_name}`;"
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query)
        data: List[Dict[str, str]] = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(data)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})



if __name__ == "__main__":
    app.run(debug=True)
