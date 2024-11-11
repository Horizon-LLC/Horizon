# test_routes.py
from flask import Blueprint
from mysql.connector import Error
from backend.database.db import get_db_connection
from typing import Optional

# Define Blueprint
test_blueprint = Blueprint('test', __name__)

# Route to test the database connection
@test_blueprint.route('/test-db', methods=['GET'])
def test_db() -> str:
    """Test the connection to the database and return the database name."""
    try:
        connection = get_db_connection()
        if connection is None:
            return "Failed to connect to the database."
        cursor = connection.cursor()
        cursor.execute("SELECT DATABASE();")
        db_name: Optional[tuple] = cursor.fetchone()
        cursor.close()
        connection.close()

        if db_name:
            return f"Connected to database named '{db_name[0]}' successfully."
        else:
            return "No database selected"
    except Error as err:
        return f"Error: {err}"
