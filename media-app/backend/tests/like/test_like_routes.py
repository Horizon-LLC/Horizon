import unittest
import json
import jwt
from unittest.mock import patch
from backend.app import app
from backend.auth import token_required

SECRET_KEY = 'HORIZON'

# Helper function to generate a JWT token for testing
def generate_test_token(user_id, username):
    payload = {'user_id': user_id, 'username': username}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Mock database state
like_state = {}  # Mock state for likes

def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            if "SELECT COUNT(*) FROM likes WHERE user_id" in query and "AND post_id" in query:
                # Mock the isLiked query
                self.results = [(1 if (params[0], params[1]) in like_state else 0,)]
            elif "INSERT INTO `like`" in query:
                # Mock createLike
                like_state[(params[0], params[1])] = True
            elif "SELECT COUNT(*) FROM likes WHERE post_id" in query:
                # Mock getTotalLikes
                self.results = [(sum(1 for (_, post_id) in like_state if post_id == params[0]),)]
            elif "DELETE FROM likes WHERE user_id" in query and "AND post_id" in query:
                # Mock deleteLike
                if (params[0], params[1]) in like_state:
                    del like_state[(params[0], params[1])]
                self.results = []

        def fetchone(self):
            return self.results[0] if self.results else None

        def close(self):
            pass

    class MockConnection:
        def cursor(self):
            return MockCursor()

        def commit(self):
            pass

        def close(self):
            pass

    return MockConnection()


class TestLikeRoutes(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.token = generate_test_token(1, 'fastfox')

        # Mock the database connection
        self.patcher = patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
        self.mock_db = self.patcher.start()

    def test_is_liked(self):
        # Add a like to the mock state
        like_state[(1, 2)] = True

        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.app.get('/is-liked?post_id=1', headers=headers)
        response_body = response.get_json()

        # Assert that the like is detected
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response_body['isLiked'])

    def test_create_like(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        data = {'post_id': 2}

        response = self.app.post('/create-like', json=data, headers=headers)
        response_body = response.get_json()

        # Assert that the like is created
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response_body['message'], 'Like created successfully')
        self.assertIn((1, 2), like_state)

    def test_get_total_likes(self):
        # Add likes to the mock state
        like_state[(1, 1)] = True
        like_state[(3, 3)] = True

        response = self.app.get('/total-likes?post_id=1')
        response_body = response.get_json()

        # Assert that the total likes are calculated
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_body['totalLikes'], 1)

    def test_delete_like(self):
        # Add a like to the mock state
        like_state[(1, 20)] = True

        headers = {'Authorization': f'Bearer {self.token}'}
        data = {'post_id': 2}

        response = self.app.delete('/delete-like', json=data, headers=headers)
        response_body = response.get_json()

        # Assert that the like is deleted
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_body['message'], 'Like deleted successfully')
        self.assertNotIn((1, 20), like_state)

if __name__ == '__main__':
    unittest.main()
