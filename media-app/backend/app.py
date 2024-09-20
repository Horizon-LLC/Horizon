import os
from flask import Flask, jsonify, Response
from flask_cors import CORS
import mysql.connector
from mysql.connector.connection import MySQLConnection
from typing import List, Dict, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# Function to establish the database connection
# Optional[MySQLConnection] for the database connection function indicates that it could return None if the connection fails.
def get_db_connection() -> Optional[MySQLConnection]:
    connection: Optional[MySQLConnection] = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    return connection

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
