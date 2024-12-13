from flask import Blueprint, request, jsonify
import mysql.connector
from backend.database.db import get_db_connection
from backend.auth import token_required

comment_blueprint = Blueprint('comment', __name__)

@comment_blueprint.route('/create-comment', methods=['POST'])
@token_required
def create_comment(user_id, username):
    data = request.get_json()
    post_id = data.get('post_id')
    content = data.get('content')
    parent_comment_id = data.get('parent_comment_id', None)  # Optional

    if not post_id or not content:
        return jsonify({"error": "Post ID and content are required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO comment (user_id, post_id, content, created_at, parent_comment_id, is_edited)
            VALUES (%s, %s, %s, NOW(), %s, 0)
        """
        cursor.execute(query, (user_id, post_id, content, parent_comment_id))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Comment created successfully!"}), 201
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500


@comment_blueprint.route('/get-comments/<int:post_id>', methods=['GET'])
@token_required
def get_comments(user_id, username, post_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT c.comment_id, c.content, c.created_at, c.updated_at, c.is_edited,
                   u.username, u.profile_pic, c.parent_comment_id
            FROM comment c
            JOIN user u ON c.user_id = u.user_id
            WHERE c.post_id = %s
            ORDER BY c.created_at ASC
        """
        cursor.execute(query, (post_id,))
        comments = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({"post_id": post_id, "comments": comments}), 200
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return jsonify({"error": "Failed to fetch comments"}), 500


