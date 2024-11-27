import unittest
import json
import jwt
from backend.app import app
from unittest.mock import patch
from backend.database.db import get_db_connection

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Mock function for database connection
def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            if params[0] == 'fastfox@example.com':
                self.result = [(1, 'testuser', 'password123')]
            else:
                self.result = []

        def fetchone(self):
            return self.result[0] if self.result else None

        def close(self):
            pass

    class MockConnection:
        def cursor(self):
            return MockCursor()

        def close(self):
            pass

    return MockConnection()

class TestTokenIssue(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_user_receives_new_token_on_login(self):
        user_data = {'email': 'fastfox@example.com', 'password': 'password123'}

        # Attempt to login and check for new token
        response = self.app.post('/login', json=user_data)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertEqual(data['username'], 'fastfox')
        self.assertEqual(data['user_id'], 1)

    def tearDown(self):
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()
