import cloudinary
import cloudinary.uploader
import uuid
import os
from django.conf import settings
import requests
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from io import BytesIO
from django.conf import settings
import random
import string
from datetime import datetime

class utils:
    @staticmethod
    def generate_password(length=10):
        characters = string.ascii_letters + string.digits
        password = ''.join(random.choices(characters, k=length))
        return password
    
    @staticmethod
    def generate_OTP(length=6):
        characters = string.digits
        password = ''.join(random.choices(characters, k=length))
        return password

class CloudinaryService:
    ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".mp3", ".mp4", ".avi", ".mov"]

    RESOURCE_TYPE_MAP = {
        ".jpg": "image",
        ".jpeg": "image",
        ".png": "image",
        ".mp3": "video",   # Cloudinary uses "video" resource_type for audio
        ".mp4": "video",
        ".avi": "video",
        ".mov": "video",
    }

    def upload_file(self, file):
        try:
            file_extension = os.path.splitext(file.name)[1].lower()

            if file_extension not in self.ALLOWED_EXTENSIONS:
                raise ValueError("Only accept files with format JPG, JPEG, PNG, MP3, MP4, AVI, or MOV")

            resource_type = self.RESOURCE_TYPE_MAP.get(file_extension, "auto")
            public_id = str(uuid.uuid4())

            result = cloudinary.uploader.upload(
                file,
                public_id=public_id,
                resource_type=resource_type,
            )

            return result["secure_url"]

        except Exception as e:
            raise Exception(f"Error uploading file to Cloudinary: {str(e)}")

    def delete_file(self, file_url):
        try:
            if not file_url or file_url.strip() == "":
                return

            # Extract public_id from Cloudinary URL
            # URL format: https://res.cloudinary.com/<cloud>/image|video/upload/v.../public_id.ext
            parts = file_url.split("/upload/")
            if len(parts) < 2:
                return
            path_with_ext = parts[1]
            # Remove version prefix if present (e.g., v1234567890/)
            if path_with_ext.startswith("v") and "/" in path_with_ext:
                path_with_ext = path_with_ext.split("/", 1)[1]
            # Remove extension
            public_id = os.path.splitext(path_with_ext)[0]

            # Determine resource_type from URL
            if "/video/upload/" in file_url:
                resource_type = "video"
            elif "/image/upload/" in file_url:
                resource_type = "image"
            else:
                resource_type = "image"

            cloudinary.uploader.destroy(public_id, resource_type=resource_type)

        except Exception as e:
            raise Exception(f"Error deleting file from Cloudinary: {str(e)}")

    def download_file(self, file_url):
        try:
            response = requests.get(file_url, stream=True)
            if response.status_code == 200:
                return response.content
            else:
                raise Exception("Download failed, status code: " + str(response.status_code))
        except Exception as e:
            raise Exception(f"Error downloading file: {str(e)}")

class mailService:
    @staticmethod
    def test(order_code, order_amount, thumbnailUrl, recipient_emails):
        send_from = settings.EMAIL_HOST_USER
        subject = 'Order Details'

        html_content = render_to_string('mail_template.html', {
            'order_code': order_code,
            'order_amount': order_amount,
            'thumbnailUrl': thumbnailUrl 
        })

        email_message = EmailMessage(
            subject,
            html_content,
            send_from,
            recipient_emails
        )
        email_message.content_subtype = "html" 

        response = requests.get(thumbnailUrl)
        if response.status_code == 200:
            file_data = BytesIO(response.content)
            email_message.attach("thumbnail.png", file_data.getvalue(), "image/png")  
        
        email_message.send()
        
    @staticmethod
    def mailActiveAccount(OTP, recipient_name, sender_name, recipient_email):
        send_from = settings.EMAIL_HOST_USER
        subject = 'Active Account'
        recipient_emails = [recipient_email,]

        html_content = render_to_string('mail_active_account.html', {
            'OTP': OTP,
            'recipient_name': recipient_name,
            'year': datetime.now().year,
            'organization': "Sportify",
            'sender_name': sender_name,
        })

        email_message = EmailMessage(
            subject,
            html_content,
            send_from,
            recipient_emails
        )
        email_message.content_subtype = "html" 
        
        email_message.send()
        
    @staticmethod
    def mailResetPassword(recipient_email, password, recipient_name, sender_name):
        send_from = settings.EMAIL_HOST_USER
        subject = 'Reset Password'
        recipient_emails = [recipient_email,]

        html_content = render_to_string('mail_reset_password.html', {
            'recipient_email': recipient_email,
            'password': password,
            'recipient_name': recipient_name,
            'year': datetime.now().year,
            'organization': "Sportify",
            'sender_name': sender_name,
        })

        email_message = EmailMessage(
            subject,
            html_content,
            send_from,
            recipient_emails
        )
        email_message.content_subtype = "html" 
        
        email_message.send()
        
    @staticmethod
    def mailApproveArtist(recipient_name, sender_name, recipient_email, details):
        send_from = settings.EMAIL_HOST_USER
        subject = 'Approve Artist'
        recipient_emails = [recipient_email,]

        html_content = render_to_string('mail_approve_artist.html', {
            'recipient_name': recipient_name,
            'sender_name': sender_name,
            'organization': "Sportify",
            'year': datetime.now().year,
            'recipient_email': recipient_email,
            'details': details,
        })

        email_message = EmailMessage(
            subject,
            html_content,
            send_from,
            recipient_emails
        )
        email_message.content_subtype = "html" 
        
        email_message.send()
        
    @staticmethod
    def mailRejectArtist(recipient_name, sender_name, recipient_email, details, reason_reject):
        send_from = settings.EMAIL_HOST_USER
        subject = 'Reject Artist'
        recipient_emails = [recipient_email,]

        html_content = render_to_string('mail_reject_artist.html', {
            'recipient_name': recipient_name,
            'sender_name': sender_name,
            'organization': "Sportify",
            'year': datetime.now().year,
            'recipient_email': recipient_email,
            'details': details,
            'reason_reject': reason_reject,
        })

        email_message = EmailMessage(
            subject,
            html_content,
            send_from,
            recipient_emails
        )
        email_message.content_subtype = "html" 
        
        email_message.send()
    