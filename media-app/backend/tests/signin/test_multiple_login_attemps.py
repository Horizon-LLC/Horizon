import unittest
import json
import jwt
from backend.app import app
from unittest.mock import patch
from backend.database.db import get_db_connection  # Import get_db_connection from the correct module

# Define the secret key directly here for testing
SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Mock function for database connection (for testing only)
def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            # Mock valid user data for two different users
            if params[0] == 'fastfox@example.com':
                self.result = [(1, 'testuser', 'password123')]
            elif params[0] == 'seconduser@example.com':
                self.result = [(2, 'seconduser', 'password456')]
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

class TestSigninRoutes(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Correctly mock the database connection function from its original module
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_multiple_user_logins(self):
        # Placeholder test for multiple user logins
        user1_data = {'email': 'fastfox@example.com', 'password': 'password123'}
        user2_data = {'email': 'silentowl@example.com', 'password': 'password123'}

        # First user login
        response1 = self.app.post('/login', json=user1_data)
        self.assertEqual(response1.status_code, 200)
        data1 = json.loads(response1.data)
        self.assertIn('token', data1)
        self.assertEqual(data1['username'], 'fastfox')
        self.assertEqual(data1['user_id'], 1)

        # Second user login
        response2 = self.app.post('/login', json=user2_data)
        # Placeholder test, multiple login authentication is done in front end
        self.assertEqual(response2.status_code, 200)
        data2 = json.loads(response2.data)
        self.assertEqual(data2['username'], 'silentowl')
        self.assertEqual(data2['user_id'], 2)

        # Note: This is just a placeholder test to verify that multiple login requests do not cause errors.
        # The frontend handles session checks, so we are not testing for duplicate login prevention here.

    def tearDown(self):
        # Stop the patcher to restore the original function
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()
