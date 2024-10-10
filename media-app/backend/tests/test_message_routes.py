import sys
import os
import unittest
import json
import jwt

# Import your Flask app
from backend.app import app

# Function to generate test JWT token
SECRET_KEY = 'HORIZON'
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

class MessageRoutesTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_create_or_fetch_chatbox(self):
        response = self.app.post('/create-or-fetch-chatbox', json={
            'user1_id': 1,
            'user2_id': 2
        })
        data = json.loads(response.data)
        self.assertIn(response.status_code, [200, 201])
        self.assertIn('chatbox_id', data)

    def test_send_message(self):
        token = generate_test_token(1, 'testuser')  # Use a valid token
        response = self.app.post('/send-message', json={
            'sender_id': 1,
            'receiver_id': 2,
            'chatbox_id': 1,  # Assuming 123 is an existing chatbox_id
            'content': 'Hello, how are you?'
        }, headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 201)

    def test_get_messages(self):
        token = generate_test_token(1, 'testuser')  # Use a valid token
        response = self.app.get('/get-messages?chatbox_id=123', headers={
            'Authorization': f'Bearer {token}'
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data['messages'], list)

if __name__ == '__main__':
    unittest.main()
