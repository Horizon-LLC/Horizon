import unittest
import jwt
from unittest.mock import patch, MagicMock
from backend.app import app

SECRET_KEY = 'HORIZON'

# Helper function to generate test tokens
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

class TestDecreasedFollowers(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'testuser')

    @patch('backend.profilepage_route.get_db_connection')
    def test_following_count_decrease(self, mock_db_connection):
        """
        Test to check if total_following count decreases after removing a following.
        """
        # Mock database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor

        # Simulate database query results for `/profile`
        mock_cursor.fetchone.side_effect = [
            (16,),  # Initial total_following
            (15,)   # Updated total_following after removal
        ]

        # Simulate database behavior for `/profile` route
        headers = {'Authorization': f'Bearer {self.token}'}

        # First GET request to `/profile`
        response_before = self.app.get('/profile', headers=headers)
        response_body_before = response_before.get_json()

        # Assert initial total_following
        self.assertEqual(response_before.status_code, 200)
        self.assertEqual(response_body_before['total_following'], 16)

        # Simulate removing a following
        mock_cursor.execute.assert_called_with(
            "DELETE FROM friendship WHERE user_id_1 = %s AND user_id_2 = %s",
            (1, 2)
        )

        # Second GET request to `/profile`
        response_after = self.app.get('/profile', headers=headers)
        response_body_after = response_after.get_json()

        # Assert updated total_following
        self.assertEqual(response_after.status_code, 200)
        self.assertEqual(response_body_after['total_following'], 15)

    def tearDown(self):
        patch.stopall()

if __name__ == '__main__':
    unittest.main()
