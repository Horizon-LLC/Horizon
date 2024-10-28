from flask import Blueprint, request, jsonify
from datetime import datetime
from backend.auth import token_required
import mysql.connector
from backend.database.db import get_db_connection
from backend.app import socketio



message_blueprint = Blueprint('message', __name__)
boolDebug = False

# Create or fetch a chatbox for two users
@message_blueprint.route('/create-or-fetch-chatbox', methods=['POST'])
@token_required
def create_or_fetch_chatbox(user_id, username):  # Accept user_id and username as arguments
    data = request.get_json()
    user1_id = data.get('user1_id')
    user2_id = data.get('user2_id')

    # Ensure both user IDs are provided
    if not user1_id or not user2_id:
        return jsonify({"error": "Both user1_id and user2_id must be provided"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()

    try:
        # Check if the chatbox already exists
        query = """
            SELECT chatbox_id 
            FROM chatbox 
            WHERE (user_id_1 = %s AND user_id_2 = %s) 
               OR (user_id_1 = %s AND user_id_2 = %s)
        """ 
        cursor.execute(query, (user1_id, user2_id, user2_id, user1_id))
        result = cursor.fetchone()

        if result:
            chatbox_id = result[0]
            # Ensure all results are processed before closing the cursor
            cursor.fetchall()
            return jsonify({"chatbox_id": chatbox_id, "message": "Chatbox exists"}), 200

        # Create a new chatbox if it doesn't exist
        query = "INSERT INTO chatbox (user_id_1, user_id_2) VALUES (%s, %s)"
        cursor.execute(query, (user1_id, user2_id))
        connection.commit()
        chatbox_id = cursor.lastrowid

        return jsonify({"chatbox_id": chatbox_id, "message": "Chatbox created"}), 201
    except mysql.connector.Error as err:
        print(f"Database Error in create_or_fetch_chatbox: {err}")
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    except Exception as e:
        print(f"Unexpected Error in create_or_fetch_chatbox: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        # Close cursor and connection after processing
        cursor.close()
        connection.close()


# Send a new message to the chatbox
@message_blueprint.route('/send-message', methods=['POST'])
@token_required
def send_message(user_id, username):
    data = request.get_json()
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    chatbox_id = data['chatbox_id']
    content = data['content']
    current_time = datetime.now()

    # Emit the message only if successfully saved to the DB
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO message (sender_id, receiver_id, chatbox_id, content, time, is_read)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (sender_id, receiver_id, chatbox_id, content, current_time, False))
        connection.commit()
        
        message_data = {
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "chatbox_id": chatbox_id,
            "content": content,
            "time": current_time.isoformat()
        }
        socketio.emit('receive_message', message_data, room=chatbox_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

    return jsonify({"message": "Message sent successfully"}), 201



# Fetch all messages for a chatbox
@message_blueprint.route('/get-messages', methods=['GET'])
@token_required
def get_messages(user_id, username):
    chatbox_id = request.args.get('chatbox_id')

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = "SELECT sender_id, receiver_id, content, time FROM message WHERE chatbox_id = %s ORDER BY time ASC"
        cursor.execute(query, (chatbox_id,))
        messages = cursor.fetchall()

        message_list = [{"sender_id": m[0], "receiver_id": m[1], "content": m[2], "time": m[3]} for m in messages]
        print("Fetched messages from DB:", message_list)  # Ensure sender_id is correct
        cursor.close()
        connection.close()

        return jsonify({"messages": message_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Fetch all messages for a chatbox, sorted by newest first
@message_blueprint.route('/get-chatbox-messages', methods=['GET'])
@token_required
def get_chatbox_messages(user_id, username):
    chatbox_id = request.args.get('chatbox_id')

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        
        # Fetch all messages for the given chatbox, sorted by time (newest first)
        query = """
            SELECT sender_id, receiver_id, content, time 
            FROM message 
            WHERE chatbox_id = %s 
            ORDER BY time DESC
        """
        cursor.execute(query, (chatbox_id,))
        messages = cursor.fetchall()

        # Create a list of message dictionaries
        message_list = [{"sender_id": m[0], "receiver_id": m[1], "content": m[2], "time": m[3]} for m in messages]
        cursor.close()
        connection.close()

        return jsonify({"messages": message_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500