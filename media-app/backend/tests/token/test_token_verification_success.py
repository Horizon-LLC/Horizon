import unittest
import json
import jwt
from backend.auth import token_required
from flask import request
from backend.app import app

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Define a regular function to test token authentication
@token_required
def mock_protected_function(user_id, username):
    return {'message': 'Token is valid, access granted.', 'user_id': user_id, 'username': username}, 200

class TestTokenAuthorization(unittest.TestCase):

    def setUp(self):
        self.token = generate_test_token(1, 'fastfox')

    def test_token_verification_success(self):
        # Manually create a request context using the Flask app instance
        with app.test_request_context(headers={'Authorization': f'Bearer {self.token}'}):
            response, status_code = mock_protected_function()
            self.assertEqual(status_code, 200)
            self.assertEqual(response['message'], 'Token is valid, access granted.')
            self.assertEqual(response['user_id'], 1)
            self.assertEqual(response['username'], 'fastfox')

if __name__ == '__main__':
    unittest.main()
