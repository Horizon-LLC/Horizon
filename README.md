# Horizon

## How to start and run flask app

### 1. Colne the repository
```bash
 git clone https://github.com/Horizon-LLC/Horizon.git
 ```
### 2. Navigate to backend directory
 ```bash
cd media-app/backend
```
### 3. Set Up the Virtual Environment:
   - **For macOS/Linux**:
     1. Make the setup script executable:
        ```bash
        chmod +x ../setup-files/setup.sh
        ```
     2. Run the setup script:
        ```bash
        bash ../setup-files/setup.sh
        ```

   - **For Windows**:
     1. Run the setup batch file:
        ```bash
        ../setup-files/setup.bat
        ```
### 4. Add database information in the .env file. Please ask Adiran or Keita. 
### 5. Run flask
```bash
flask run
```
### Note for macOS/Linux:
When you run flask, make sure you activate virtual environment.
```bash
source venv/bin/activate
flask run
```

### 6. Navigate to the Frontend:
open another terminal and navigate to the frontend directory like 
```bash
cd path/to/../frontend
```

### 7.  Install React Dependencies:
```bash
npm install
```

### 8. Start the React
```bash
npm start
```

### Final Note :
You will now have two terminals running:
* One for Flask (Backend) on http://localhost:5000.
* One for React (Frontend) on http://localhost:3000.

Copy http://localhost:3000 and paste on your brower to view the frontend, and React will fetch data from Flask when needed.

