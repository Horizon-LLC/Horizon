import unittest
import jwt
from unittest.mock import patch, MagicMock
from backend.app import app

SECRET_KEY = 'HORIZON'

def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

class TestCreateComment(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'testuser')

    @patch('backend.database.db.get_db_connection')
    def test_create_comment_success(self, mock_db_connection):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor

        headers = {'Authorization': f'Bearer {self.token}'}
        data = {"post_id": 1, "content": "This is a comment"}

        response = self.app.post('/create-comment', json=data, headers=headers)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()["message"], "Comment created successfully!")

    def tearDown(self):
        patch.stopall()

if __name__ == '__main__':
    unittest.main()
