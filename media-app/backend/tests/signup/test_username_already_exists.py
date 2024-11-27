import unittest
import json
from backend.app import app

class TestUserSignup(unittest.TestCase):

    def setUp(self):
        # Setup the Flask test client
        self.app = app.test_client()
        self.app.testing = True

    def test_username_already_exists(self):
        # Create a user
        existing_user = {
            'username': 'existinguser',
            'email': 'existinguser@example.com',
            'password': 'password123',
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': '1990-01-01',
            'security_question': 'What is your pet\'s name?',
            'security_answer': 'Fluffy'
        }

        response = self.app.post('/createUser', json=existing_user)
        self.assertEqual(response.status_code, 201)  # Successful user creation

        # Now try to create another user with the same username
        new_user = {
            'username': 'existinguser',
            'email': 'newuser@example.com',
            'password': 'password456',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'date_of_birth': '1992-02-02',
            'security_question': 'What is your favorite color?',
            'security_answer': 'Blue'
        }

        # Try creating a second user with the same username
        response = self.app.post('/createUser', json=new_user)
        response_body = json.loads(response.data)

        # Assertions
        self.assertEqual(response.status_code, 400)  # HTTP 400 Bad Request for duplicate username
        self.assertIn('error', response_body)
        self.assertEqual(response_body['error'], 'Username already exists')

    def tearDown(self):
        # Cleanup after each test if necessary (e.g., closing resources)
        pass

if __name__ == '__main__':
    unittest.main()