import os
import sys
import django
import sqlite3
from datetime import datetime, date

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'courier_backend.settings')

try:
    import django
    django.setup()
    
    from django.core.management import execute_from_command_line
    from accounts.models import User
    from shipments.models import Shipment, ShipmentTracking
    from payments.models import Payment
    
    print("Setting up database...")
    
    # Create migrations and migrate
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("Creating sample data...")
    
    # Create admin user
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_user(
            username='admin',
            email='admin@courier.com',
            password='admin123',
            role='admin',
            first_name='Admin',
            last_name='User',
            is_staff=True,
            is_superuser=True,
            is_verified=True
        )
        print("Admin user created: admin/admin123")
    
    # Create courier user
    if not User.objects.filter(username='courier1').exists():
        courier = User.objects.create_user(
            username='courier1',
            email='courier@courier.com',
            password='courier123',
            role='courier',
            first_name='John',
            last_name='Courier',
            phone='+1234567890',
            address='123 Courier St',
            is_verified=True
        )
        print("Courier user created: courier1/courier123")
    
    # Create customer user
    if not User.objects.filter(username='customer1').exists():
        customer = User.objects.create_user(
            username='customer1',
            email='customer@example.com',
            password='customer123',
            role='customer',
            first_name='Jane',
            last_name='Customer',
            phone='+1234567891',
            address='456 Customer Ave',
            is_verified=True
        )
        print("Customer user created: customer1/customer123")
    
    # Create sample shipments
    if not Shipment.objects.exists():
        customer = User.objects.get(username='customer1')
        courier = User.objects.get(username='courier1')
        
        shipment1 = Shipment.objects.create(
            tracking_id='TRK12345678',
            sender=customer,
            receiver_name='Alice Johnson',
            receiver_phone='+1234567892',
            receiver_address='789 Receiver Rd, City, State 12345',
            package_description='Electronics - Laptop',
            weight=2.5,
            dimensions='40x30x5 cm',
            pickup_address='456 Customer Ave, City, State 12345',
            delivery_address='789 Receiver Rd, City, State 12345',
            cost=25.00,
            payment_method='online',
            payment_status=True,
            status='in_transit',
            assigned_courier=courier
        )
        
        # Create tracking history
        ShipmentTracking.objects.create(
            shipment=shipment1,
            status='Booked',
            location='Origin Hub',
            description='Package has been booked'
        )
        
        ShipmentTracking.objects.create(
            shipment=shipment1,
            status='Picked Up',
            location='Customer Location',
            description='Package picked up from sender'
        )
        
        ShipmentTracking.objects.create(
            shipment=shipment1,
            status='In Transit',
            location='Transit Hub',
            description='Package is in transit'
        )
        
        # Create payment record
        Payment.objects.create(
            shipment=shipment1,
            amount=25.00,
            payment_method='card',
            payment_status='completed',
            transaction_id='TXN12345678'
        )
        
        print("Sample shipment created: TRK12345678")
    
    print("\nSetup completed successfully!")
    print("\nTest accounts:")
    print("Admin: admin/admin123")
    print("Courier: courier1/courier123") 
    print("Customer: customer1/customer123")
    print("\nSample tracking ID: TRK12345678")
    print("\nRun: python manage.py runserver")
    
except ImportError as e:
    print(f"Django not properly installed: {e}")
    print("Installing required packages...")
    import subprocess
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    print("Please run this script again after installation.")
except Exception as e:
    print(f"Error during setup: {e}")
    print("Creating database manually...")
    
    # Fallback: Create SQLite database manually
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    
    # Create basic tables (simplified)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS auth_user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(150) UNIQUE NOT NULL,
        email VARCHAR(254),
        password VARCHAR(128),
        first_name VARCHAR(150),
        last_name VARCHAR(150),
        is_active BOOLEAN DEFAULT 1,
        is_staff BOOLEAN DEFAULT 0,
        is_superuser BOOLEAN DEFAULT 0,
        date_joined DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()
    print("Basic database created. Please install Django and run setup again.")