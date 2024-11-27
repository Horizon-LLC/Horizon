import unittest
import json
import jwt
from backend.auth import token_required
from flask import request
from backend.app import app
from datetime import datetime, timedelta

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username, expired=False):
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(minutes=-1 if expired else 30)  # Set expired if needed
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Define a regular function to test token authentication
@token_required
def mock_protected_function(user_id, username):
    return {'message': 'Token is valid, access granted.', 'user_id': user_id, 'username': username}, 200

class TestTokenAuthorization(unittest.TestCase):

    def setUp(self):
        self.valid_token = generate_test_token(1, 'fastfox')
        self.expired_token = generate_test_token(1, 'fastfox', expired=True)
        self.invalid_token = "invalid.token.signature"

    def test_token_missing(self):
        with app.test_request_context(headers={}):  # No Authorization header
            response, status_code = mock_protected_function()  # Unpack the tuple
            self.assertEqual(status_code, 401)
            response_body = response.get_json()  # Parse the JSON data from the Response object
            self.assertEqual(response_body['message'], 'Token is missing')


if __name__ == '__main__':
    unittest.main()
