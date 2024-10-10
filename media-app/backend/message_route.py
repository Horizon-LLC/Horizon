from flask import Blueprint, request, jsonify
from datetime import datetime
from backend.database.db import get_db_connection
from backend.dashboard_route import token_required


message_blueprint = Blueprint('message', __name__)
boolDebug = True;

# Create or fetch a chatbox for two users
@message_blueprint.route('/create-or-fetch-chatbox', methods=['POST'])
def create_or_fetch_chatbox():
    data = request.get_json()
    user1_id = min(data['user1_id'], data['user2_id'])
    user2_id = max(data['user1_id'], data['user2_id'])

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Check if the chatbox already exists
        query = "SELECT chatbox_id FROM chatbox WHERE user_id_1 = %s AND user_id_2 = %s"
        cursor.execute(query, (user1_id, user2_id))
        result = cursor.fetchone()

        if result:
            chatbox_id = result[0]
            return jsonify({"chatbox_id": chatbox_id, "message": "Chatbox exists"}), 200

        # Create a new chatbox if it doesn't exist
        query = "INSERT INTO chatbox (user_id_1, user_id_2) VALUES (%s, %s)"
        cursor.execute(query, (user1_id, user2_id))
        connection.commit()
        chatbox_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return jsonify({"chatbox_id": chatbox_id, "message": "Chatbox created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Send a new message to the chatbox
@message_blueprint.route('/send-message', methods=['POST'])
@token_required
def send_message(user_id, username):
    data = request.get_json()
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    chatbox_id = data['chatbox_id']
    content = data['content']

    if not content:
        return jsonify({"error": "Message content cannot be empty"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        if(boolDebug):
            # Debugging print statements to check the values
            print(f"Sender ID: {sender_id}")
            print(f"Receiver ID: {receiver_id}")
            print(f"Chatbox ID: {chatbox_id}")
            print(f"Content: {content}")

        # Add the current timestamp for the `time` field
        current_time = datetime.now()

        query = """
            INSERT INTO message (sender_id, receiver_id, chatbox_id, content, time, is_read)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (sender_id, receiver_id, chatbox_id, content, current_time, False))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Message sent successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
        cursor.close()
        connection.close()

        return jsonify({"messages": message_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500