@echo off

REM Step 1: Navigate to the backend directory (if not already in it)
cd ..\media-app\backend

REM Step 2: Create a virtual environment
python -m venv venv

REM Step 3: Activate the virtual environment
call venv\Scripts\activate

REM Step 4: Install necessary dependencies
pip install Flask
pip install Flask-SQLAlchemy
pip install Flask-Migrate
pip install Flask-WTF
pip install Flask-Login
pip install python-dotenv
pip install psycopg2-binary

REM Step 5: Freeze dependencies to requirements.txt
pip freeze > requirements.txt

REM Step 6: Set environment variables
set FLASK_ENV=development
set FLASK_APP=app.py

REM Step 7: Create .env file with placeholder content (optional)
echo FLASK_ENV=development > .env
echo FLASK_APP=app.py >> .env

echo Virtual environment setup complete!
echo To start the Flask app, run: venv\Scripts\activate && flask run
