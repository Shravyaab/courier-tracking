import subprocess
import sys
import os

# Install packages first
print("Installing packages...")
subprocess.run([sys.executable, '-m', 'pip', 'install', 'Django', 'djangorestframework', 'django-cors-headers', 'djangorestframework-simplejwt'])

# Set environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'courier_backend.settings')

# Now import Django
import django
django.setup()

from django.core.management import execute_from_command_line

print("Creating migrations...")
execute_from_command_line(['manage.py', 'makemigrations', 'accounts'])
execute_from_command_line(['manage.py', 'makemigrations', 'shipments'])
execute_from_command_line(['manage.py', 'makemigrations', 'payments'])
execute_from_command_line(['manage.py', 'makemigrations', 'support'])
execute_from_command_line(['manage.py', 'migrate'])

print("Creating superuser...")
from accounts.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@test.com', 'admin123', role='admin')
    print("Admin created: admin/admin123")

print("Setup complete! Run: python manage.py runserver")