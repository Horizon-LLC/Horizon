import os
from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector.connection import MySQLConnection
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# Function to establish the database connection
def get_db_connection() -> MySQLConnection:
    connection = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    return connection

# Route to test the database connection
@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT DATABASE();")
        db_name = cursor.fetchone()
        cursor.close()
        connection.close()
        return f"Connected to database named '{db_name[0]}' successfully"
    except mysql.connector.Error as err:
        return f"Error: {err}"

# Route to fetch all users from the 'user' table
@app.route('/allUsers', methods=['GET'])
def get_all_users():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)  # Get results as dictionary
        cursor.execute("SELECT * FROM user")  # Query user data
        users: List[Dict[str, str]] = cursor.fetchall()  # Fetch all user records
        cursor.close()
        connection.close()
        return jsonify(users)  # Return JSON response
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})

if __name__ == "__main__":
    app.run(debug=True)
