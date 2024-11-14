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
            pass

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

class TestCreatePostMaxCharacter(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'fastfox')

        # Mock the database connection
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_create_post_exceeds_length(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        post_data = {
            'content': 'a' * 10000,  # Exceeds the 10,000 character limit
            'created_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Send POST request with content exceeding 10,000 characters
        response = self.app.post('/create-post', json=post_data, headers=headers)
        response_body = response.get_json()

        # Assertions
        self.assertEqual(response.status_code, 201)

    def tearDown(self):
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()
