import boto3
import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv



load_dotenv()

print("AWS_ACCESS_KEY_ID:", os.getenv("AWS_ACCESS_KEY_ID"))
print("AWS_SECRET_ACCESS_KEY:", os.getenv("AWS_SECRET_ACCESS_KEY"))

aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")


# S3 bucket configuration
bucket_name = 'horizon-profile-pictures-bucket'

# S3 client setup
s3 = boto3.client(
    's3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

# Test uploading a local file
try:
    # Ensure the file exists in the same directory as the script
    with open("test-file.jpg", "rb") as f:  # Adjust the path if necessary
        s3.upload_fileobj(f, bucket_name, "test-folder/test-file.jpg")  # S3 path
    print("Upload successful")
except FileNotFoundError:
    print("Error: test-file.jpg not found. Ensure the file is in the correct directory.")
except Exception as e:
    print(f"Error uploading to S3: {e}")

# Function to upload a file to S3
def upload_to_s3(file, filename):
    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            filename,
            ExtraArgs={"ContentType": file.content_type}  # No ACL
        )
        file_url = f"https://{bucket_name}.s3.amazonaws.com/{filename}"
        return file_url
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        return None

