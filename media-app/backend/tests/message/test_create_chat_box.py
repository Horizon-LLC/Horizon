import unittest
import json
import jwt
from unittest.mock import patch
from backend.app import app
from backend.auth import token_required
from datetime import datetime

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')
chatbox_state = {}  # Reset state for each test run

def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            if "SELECT chatbox_id" in query:
                # Check if the chatbox exists in the mock state
                if (params[0], params[1]) in chatbox_state or (params[1], params[0]) in chatbox_state:
                    chatbox_id = chatbox_state.get((params[0], params[1])) or chatbox_state.get((params[1], params[0]))
                    self.results = [(chatbox_id,)]
                else:
                    self.results = []

            elif "INSERT INTO chatbox" in query:
                # Create a new chatbox if it does not exist
                if (params[0], params[1]) not in chatbox_state and (params[1], params[0]) not in chatbox_state:
                    chatbox_id = len(chatbox_state) + 1
                    chatbox_state[(params[0], params[1])] = chatbox_id
                    self.lastrowid = chatbox_id
                    self.results = []

        def fetchone(self):
            return self.results[0] if self.results else None

        def close(self):
            pass

    class MockConnection:
        def cursor(self):
            return MockCursor()

        def commit(self):
            pass

        def close(self):
            pass

    return MockConnection()

class TestCreateOrFetchChatbox(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'fastfox')

        # Mock the database connection
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_create_new_chatbox(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        data = {'user1_id': 1, 'user2_id': 5}

        # Make a POST request to create a new chatbox
        response = self.app.post('/create-or-fetch-chatbox', json=data, headers=headers)
        response_body = response.get_json()

        # Assert that a new chatbox is created
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_body['chatbox_id'], 12)
        self.assertEqual(response_body['message'], 'Chatbox exists')

    def tearDown(self):
        self.patcher.stop()
        global chatbox_state
        chatbox_state.clear()  # Clear state between tests

if __name__ == '__main__':
    unittest.main()


