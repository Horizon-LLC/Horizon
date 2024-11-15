import unittest
import json
from backend.app import app

class TestUserSignup(unittest.TestCase):

    def setUp(self):
        # Setup the Flask test client
        self.app = app.test_client()
        self.app.testing = True

    def test_email_already_exists(self):
        # First, create a user with an email
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
        # POST request to create the first user
        response = self.app.post('/createUser', json=existing_user)
        self.assertEqual(response.status_code, 201)  # Assuming the user creation is successful

        # Now try to create another user with the same email
        new_user = {
            'username': 'newuser',
            'email': 'existinguser@example.com',  # Duplicate email
            'password': 'password456',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'date_of_birth': '1992-02-02',
            'security_question': 'What is your favorite color?',
            'security_answer': 'Blue'
        }

        # POST request to try creating a second user with the same email
        response = self.app.post('/createUser', json=new_user)
        response_body = json.loads(response.data)

        # Assertions
        self.assertEqual(response.status_code, 400)  # HTTP 400 Bad Request for duplicate email
        self.assertIn('error', response_body)
        self.assertEqual(response_body['error'], 'Email already exists')

    def tearDown(self):
        # Cleanup after each test if necessary (e.g., closing resources)
        pass

if __name__ == '__main__':
    unittest.main()