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
        self.valid_token = generate_test_token(1, 'fastfox')
        self.invalid_token = "invalid.token.signature"

    def test_token_invalid(self):
        with app.test_request_context(headers={'Authorization': f'Bearer {self.invalid_token}'}):
            response, status_code = mock_protected_function()
            self.assertEqual(status_code, 401)
            response_body = response.get_json()
            self.assertEqual(response_body['message'], 'Token is invalid')

if __name__ == '__main__':
    unittest.main()
