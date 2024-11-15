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

# Mock function for the database connection
def mock_get_db_connection():
    class MockCursor:
        def __init__(self):
            self.results = []

        def execute(self, query, params):
            if "SELECT chatbox_id" in query:
                if params == (1, 2, 2, 1):
                    # Simulate an existing chatbox
                    self.results = [(123,)]
                else:
                    self.results = []

            elif "INSERT INTO chatbox" in query:
                self.lastrowid = 456  # Mock chatbox creation

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

    def test_chatbox_exists(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        data = {'user1_id': 1, 'user2_id': 2}

        response = self.app.post('/create-or-fetch-chatbox', json=data, headers=headers)
        response_body = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_body['chatbox_id'], 1)
        self.assertEqual(response_body['message'], 'Chatbox exists')

    def tearDown(self):
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()
