import unittest
import json
import jwt
from backend.app import app

SECRET_KEY = 'HORIZON'

# Function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


class TestGetMessages(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_get_messages_success(self):
        token = generate_test_token(1, 'testuser')
        response = self.app.get('/get-messages?chatbox_id=1', headers={
            'Authorization': f'Bearer {token}'
        })

        # Print response for debugging
        print("Status Code:", response.status_code)
        print("Response Data:", response.data.decode())

        # Assert the response is successful
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data['messages'], list)


if __name__ == '__main__':
    unittest.main()
