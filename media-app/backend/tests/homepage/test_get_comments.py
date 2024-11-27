import unittest
import jwt
from unittest.mock import patch, MagicMock
from backend.app import app

SECRET_KEY = 'HORIZON'

def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

class TestGetComments(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'testuser')

    @patch('backend.database.db.get_db_connection')
    def test_get_comments_success(self, mock_db_connection):
        """
        Test to ensure GET request for comments by post ID returns successfully.
        """
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor

        # Mocking some comments
        mock_cursor.fetchall.return_value = [
            {"comment_id": 1, "content": "Great post!", "created_at": "2024-11-01 10:00:00", "username": "user1"},
            {"comment_id": 2, "content": "Thanks for sharing!", "created_at": "2024-11-02 12:30:00", "username": "user2"},
        ]

        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.app.get('/get-comments/1', headers=headers)

        response_body = response.get_json()
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertIn('comments', response_body)
        self.assertGreater(len(response_body['comments']), 0)  # Pass if any comments exist

    def tearDown(self):
        patch.stopall()

if __name__ == '__main__':
    unittest.main()
