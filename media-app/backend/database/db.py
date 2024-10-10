# db.py
import os
import mysql.connector
from mysql.connector.connection import MySQLConnection
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from .env file
load_dotenv()

# Function to establish the database connection
def get_db_connection() -> Optional[MySQLConnection]:
    connection: Optional[MySQLConnection] = mysql.connector.connect(
        host='horizon-llc.cdcgg8uief43.us-east-1.rds.amazonaws.com',
        user='admin',
        password='horizon4800',
        database='horizon',
        port=3306,
        use_pure=True
    )
    return connection
