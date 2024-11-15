import unittest
import jwt
from unittest.mock import patch, MagicMock
from backend.app import app

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

class TestViewPosts(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'testuser')

    @patch('backend.database.db.get_db_connection')  # Correct path
    def test_view_posts_success(self, mock_db_connection):
        """
        Test to ensure GET request for posts returns successfully with posts data.
        """
        # Mock database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor

        # Simulate database query results (mocked only)
        mock_cursor.fetchall.return_value = [
            ('Test post content 1', '2024-11-01 10:00:00'),
            ('Test post content 2', '2024-11-02 15:30:00'),
        ]

        # Simulate a GET request
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.app.get('/dashboard', headers=headers)

        # Parse response body
        response_body = response.get_json()

        # Debugging print statements
        print("Response Body:", response_body)

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertIn('posts', response_body)
        self.assertGreater(len(response_body['posts']), 0, "No posts were returned!")

    def tearDown(self):
        patch.stopall()

if __name__ == '__main__':
    unittest.main()
