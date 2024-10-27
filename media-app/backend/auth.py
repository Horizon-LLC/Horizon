from functools import wraps
from flask import request, jsonify
import jwt

SECRET_KEY = 'HORIZON'

# Utility function to verify JWT token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        #JWT is passed in the request headers
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = data['user_id']
            username = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(user_id, username, *args, **kwargs)

    return decorated