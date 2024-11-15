import unittest
import json
from unittest.mock import patch
from backend.app import app
from backend.database.db import get_db_connection

# Mock database connection
def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            # Simulate no duplicate user
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

class TestUserSignupFieldValidation(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Patch the database connection
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_missing_username_field(self):
        # Mock user data with missing `username` field
        incomplete_user_data = {
            'email': 'newuser@example.com',
            'password': 'securepassword123'
        }

        # POST request to the signup endpoint
        response = self.app.post('/createUser', json=incomplete_user_data)
        response_body = json.loads(response.data)

        # Assertions
        self.assertEqual(response.status_code, 400)  # HTTP 400 Bad Request
        self.assertIn('error', response_body)
        self.assertEqual(response_body['error'], 'One or more blank fields')

    def test_missing_email_field(self):
        # Mock user data with missing `email` field
        incomplete_user_data = {
            'username': 'newuser',
            'password': 'securepassword123'
        }

        # POST request to the signup endpoint
        response = self.app.post('/createUser', json=incomplete_user_data)
        response_body = json.loads(response.data)

        # Assertions
        self.assertEqual(response.status_code, 400)  # HTTP 400 Bad Request
        self.assertIn('error', response_body)
        self.assertEqual(response_body['error'], 'One or more blank fields')

    def test_missing_password_field(self):
        # Mock user data with missing `password` field
        incomplete_user_data = {
            'username': 'newuser',
            'email': 'newuser@example.com'
        }

        # POST request to the signup endpoint
        response = self.app.post('/createUser', json=incomplete_user_data)
        response_body = json.loads(response.data)

        # Assertions
        self.assertEqual(response.status_code, 400)  # HTTP 400 Bad Request
        self.assertIn('error', response_body)
        self.assertEqual(response_body['error'], 'One or more blank fields')

    def tearDown(self):
        # Stop the patcher to restore the original function
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()
