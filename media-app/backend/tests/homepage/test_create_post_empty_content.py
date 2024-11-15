import unittest
import json
import jwt
from backend.auth import token_required
from backend.app import app
from unittest.mock import patch
from backend.database.db import get_db_connection
from datetime import datetime

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Mock function for database connection (for testing only)
def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            # Mock successful database insert
            self.result = {'content': params[0], 'created_at': params[1], 'user_id': params[2]}

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

class TestCreatePost(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'fastfox')

        # Mock the database connection
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_create_post_empty_content(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        post_data = {
            'content': '',
            'created_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Send POST request with empty content
        response = self.app.post('/create-post', json=post_data, headers=headers)
        response_body = response.get_json()

        # Assertions
        # TODO setup empty error in create-post route function
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response_body['error'], 'Post content cannot be empty')

    def tearDown(self):
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()
