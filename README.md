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