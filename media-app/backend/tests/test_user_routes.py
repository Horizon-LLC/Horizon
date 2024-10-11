import unittest
from backend.app import app  # Import your Flask app
import json

class UserRoutesTestCase(unittest.TestCase):

    def setUp(self):
        # Setup the test client
        self.app = app.test_client()
        self.app.testing = True

    # Test fetching all users with only user_id and username
    def test_get_all_users_light(self):
        response = self.app.get('/users')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIsInstance(data, list)  # Assert that the response is a list
        if data:  # If there are any users in the database, check their structure
            self.assertIn('user_id', data[0])
            self.assertIn('username', data[0])

    # Test fetching a single user by user_id
    def test_get_single_user(self):
        # Assuming user with user_id 1 exists
        response = self.app.get('/user/1')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIsInstance(data, dict)  # Assert that the response is a dictionary
        self.assertIn('user_id', data)
        self.assertIn('first_name', data)
        self.assertIn('last_name', data)
        self.assertIn('username', data)
        self.assertIn('email', data)
        self.assertIn('date_of_birth', data)
        self.assertIn('is_verified', data)

    # Test fetching a non-existent user (should return 404)
    def test_get_nonexistent_user(self):
        # Assuming user with user_id 999 does not exist
        response = self.app.get('/user/999')
        self.assertEqual(response.status_code, 404)

        data = json.loads(response.data)
        self.assertIn('error', data)  # Ensure the error key is in the response
        self.assertEqual(data['error'], 'User not found')


if __name__ == '__main__':
    unittest.main()
