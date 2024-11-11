import unittest
import json
import jwt
from backend.app import app

SECRET_KEY = 'HORIZON'


# Function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


class TestSendMessage(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_send_message_success(self):
        token = generate_test_token(1, 'testuser')
        response = self.app.post('/send-message', json={
            'sender_id': 1,
            'receiver_id': 2,
            'chatbox_id': 1,
            'content': 'Hello, how are you?'
        }, headers={'Authorization': f'Bearer {token}'})

        # Assert the response is successful
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn("Message sent successfully", data.get("message", ""))


if __name__ == '__main__':
    unittest.main()