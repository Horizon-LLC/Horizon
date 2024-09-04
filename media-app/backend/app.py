from flask import Flask
import mysql.connector

app = Flask(__name__)

#connecting to the database
def get_db_connection():
    connection = mysql.connector.connect(
        host='horizon-llc.cdcgg8uief43.us-east-1.rds.amazonaws.com',
        user='admin',
        password='horizon4800',
        database='horizon'
    )
    return connection

# checking if it connected to the database correctly 
# run the flask app to see by running "python app.py" in the backend folder and then
# opening your browser and going to "http://localhost:5000/test-db"
# "ctrl + C to end it in the terminal"
@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT DATABASE();")
        db_name = cursor.fetchone()
        cursor.close()
        connection.close()
        return f"connected to database named ' {db_name[0]} ' successfully "
    except mysql.connector.Error as err:
        return f"Error: {err}"
    
if __name__ == "__main__":
    app.run(debug=True)