from flask import Flask
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    connection = mysql.connector.connect(
        host='horizon-llc.cdcgg8uief43.us-east-1.rds.amazonaws.com',
        user='admin',
        password='horizon4800',
        database='horizon'
    )
    return connection