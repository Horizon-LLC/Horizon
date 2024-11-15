import unittest
import json
from unittest.mock import patch
from backend.app import app
from backend.database.db import get_db_connection

# Mock database connection function for testing
def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            if "INSERT INTO users" in query:
                # Simulate successful user creation
                self.lastrowid = 1  # Mock ID of the newly created user
                self.result = []
            elif "SELECT * FROM users WHERE email" in query:
                # Simulate no existing user with the same email
                self.result = []

        def fetchone(self):
            return self.result[0] if self.result else None

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

class TestUserSignup(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Patch the database connection
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def tearDown(self):
        self.patcher.stop()

    def test_successful_signup(self):
        # Mock user data for signup
        new_user = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepassword123',
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': '1990-01-01',  # Use ISO 8601 format for dates
            'security_question': 'What is your favorite color?',
            'security_answer': 'Blue'
        }

        # POST request to the createUser route
        response = self.app.post('/createUser', json=new_user)
        response_body = json.loads(response.data)

        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertIn('message', response_body)
        self.assertEqual(response_body['message'], 'User created successfully!')

if __name__ == '__main__':
    unittest.main()