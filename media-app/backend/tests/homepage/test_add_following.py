import unittest
import jwt
from unittest.mock import patch, MagicMock
from backend.app import app  # Assuming `app` is the Flask app

SECRET_KEY = 'HORIZON'

# Helper function to generate test tokens
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

class TestAddFriend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'testuser')

    @patch('backend.friendpage_route.get_db_connection')
    def test_add_friend_success(self, mock_db_connection):
        """
        Test case for successful friend addition.
        """
        # Mock database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor

        headers = {'Authorization': f'Bearer {self.token}'}
        friend_data = {'userId': 2}

        # Simulate a POST request
        response = self.app.post('/add-friend', json=friend_data, headers=headers)
        response_body = response.get_json()

        print(f"Response status: {response.status_code}, Response body: {response_body}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_body['message'], 'Friendship created successfully!')

    @patch('backend.friendpage_route.get_db_connection', side_effect=Exception('Database connection failed'))
    def test_add_friend_db_error(self, mock_db_connection):
        """
        Test case to verify response for a database error.
        """
        headers = {'Authorization': f'Bearer {self.token}'}
        friend_data = {'userId': 2}

        # Simulate a POST request
        response = self.app.post('/add-friend', json=friend_data, headers=headers)
        response_body = response.get_json()

        print(f"Response status: {response.status_code}, Response body: {response_body}")
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response_body['error'], 'Unexpected error: Database connection failed')

if __name__ == '__main__':
    unittest.main()
