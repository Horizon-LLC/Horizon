from unittest.mock import patch

# Mock function for database connection
def mock_get_db_connection():
    class MockCursor:
        def execute(self, query, params):
            if params[0] == 'valid@example.com':
                self.result = [(1, 'testuser', 'password123')]
            else:
                self.result = []

        def fetchone(self):
            return self.result[0] if self.result else None

        def close(self):
            pass

    class MockConnection:
        def cursor(self):
            return MockCursor()

        def close(self):
            pass

    return MockConnection()

# Decorator to use mock database in tests
@patch('backend.database.db.get_db_connection', side_effect=mock_get_db_connection)
def use_mock_db(func):
    return func
