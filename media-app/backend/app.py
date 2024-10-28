from urllib import request

from flask import Flask, json, jsonify, redirect, Response, render_template, session, url_for
from flask_cors import CORS
import mysql.connector
from typing import List, Dict, Optional, Union, Tuple
import os
from flask_socketio import SocketIO, join_room

# from werkzeug.security import check_password_hash

# from graphviz import render

app = Flask(__name__)
app.secret_key = os.urandom(24)
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins='*', manage_session=False)

from backend.database.db import get_db_connection
from backend.database.test_routes import test_blueprint  # Import test blueprint
from backend.user_routes import user_blueprint # Import the blueprint
from backend.dashboard_route import dashboard_blueprint # Import the dashboard blueprint
from backend.message_route import message_blueprint
from backend.profilepage_route import profile_blueprint
from backend.friendpage_route import friend_blueprint




# Register the user blueprint
app.register_blueprint(user_blueprint)
app.register_blueprint(test_blueprint)  # Register the test routes blueprint
app.register_blueprint(dashboard_blueprint)
app.register_blueprint(message_blueprint)
app.register_blueprint(profile_blueprint)
app.register_blueprint(friend_blueprint)

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



@app.after_request
def apply_cors(response):
    response.headers['Access-Control-Allow-Origin'] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Allow OPTIONS requests
@app.route('/profile/posts', methods=['OPTIONS'])
def handle_options():
    response = jsonify({"message": "Options OK"})
    response.headers['Access-Control-Allow-Origin'] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@socketio.on('join_room')
def join_room_handler(data):
    # Ensure `data` is in dictionary form
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except ValueError:
            print("Invalid data format:", data)
            return

    chatbox_id = data.get('chatbox_id')
    if chatbox_id:
        join_room(chatbox_id)
        print(f"User joined room: {chatbox_id}")
    else:
        print("chatbox_id not provided in join_room data:", data)



    
if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)