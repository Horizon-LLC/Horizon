import unittest
from unittest.mock import patch
from backend.app import app
import jwt
import json

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Mock database state
mock_posts = [
    (1, "Hello, world!", "2024-12-03 10:00:00"),
    (2, "Another post here.", "2024-12-03 09:30:00"),
]

mock_usernames = {1: "fastfox", 2: "quickrabbit"}

def mock_fetch_username_by_user_id(user_id):
    return mock_usernames.get(user_id, None)

def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params=None):
            if "FROM post" in query:
                self.results = mock_posts

        def fetchall(self):
            return self.results

        def close(self):
            pass

    class MockConnection:
        def cursor(self):
            return MockCursor()

        def close(self):
            pass

    return MockConnection()

class TestDashboard(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'testuser')

        # Mock the database connection
        self.db_patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.db_patcher.start()

        # Mock the fetch_username_by_user_id function
        self.username_patcher = patch('backend.dashboard_route.fetch_username_by_user_id', side_effect=mock_fetch_username_by_user_id)
        self.mock_username = self.username_patcher.start()

    def tearDown(self):
        self.db_patcher.stop()
        self.username_patcher.stop()

    def test_dashboard(self):
        headers = {'Authorization': f'Bearer {self.token}'}

        response = self.app.get('/dashboard', headers=headers)
        response_body = response.get_json()

        # Assert the response status code
        self.assertEqual(response.status_code, 200)

        # # Assert the response data
        # expected_posts = [
        #     {"username": "fastfox", "content": "Hello, world!", "created_at": "2024-12-03 10:00:00"},
        #     {"username": "quickrabbit", "content": "Another post here.", "created_at": "2024-12-03 09:30:00"},
        # ]
        # self.assertEqual(response_body['posts'], expected_posts)

if __name__ == '__main__':
    unittest.main()
