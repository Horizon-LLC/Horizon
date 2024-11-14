import unittest
import json
import jwt
from unittest.mock import patch
from backend.app import app
from backend.database.db import get_db_connection

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Mock function for the database connection
def mock_get_db_connection():
    class MockCursor:
        def __init__(self):
            self.results = [
                {"user_id": 2, "username": "friend1"},
                {"user_id": 3, "username": "friend2"}
            ]

        def execute(self, query, params):
            pass

        def fetchall(self):
            return self.results

        def close(self):
            pass

    class MockConnection:
        def cursor(self, dictionary=True):
            return MockCursor()

        def close(self):
            pass

    return MockConnection()

class TestGetUserFriends(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'fastfox')

        # Mock the database connection
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_get_user_friends_success(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.app.get('/profile/friends', headers=headers)
        response_body = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response_body, list)
        self.assertEqual(len(response_body), 3)


    def tearDown(self):
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()
