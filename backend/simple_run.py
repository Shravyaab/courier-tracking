from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
import os

# Create database and tables
def setup_database():
    conn = sqlite3.connect('courier.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT,
        role TEXT DEFAULT 'customer',
        phone TEXT,
        first_name TEXT,
        last_name TEXT
    )''')
    
    # Shipments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS shipments (
        id INTEGER PRIMARY KEY,
        tracking_id TEXT UNIQUE,
        sender_id INTEGER,
        receiver_name TEXT,
        receiver_phone TEXT,
        receiver_address TEXT,
        package_description TEXT,
        weight REAL,
        pickup_address TEXT,
        delivery_address TEXT,
        cost REAL,
        status TEXT DEFAULT 'booked',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Tracking history table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tracking_history (
        id INTEGER PRIMARY KEY,
        shipment_id INTEGER,
        status TEXT,
        location TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Insert sample data
    cursor.execute("INSERT OR IGNORE INTO users VALUES (1, 'admin', 'admin@test.com', 'admin123', 'admin', '1234567890', 'Admin', 'User')")
    cursor.execute("INSERT OR IGNORE INTO users VALUES (2, 'customer1', 'customer@test.com', 'customer123', 'customer', '1234567891', 'John', 'Doe')")
    
    cursor.execute("INSERT OR IGNORE INTO shipments VALUES (1, 'TRK12345678', 2, 'Jane Smith', '1234567892', '123 Main St', 'Electronics', 2.5, '456 Oak Ave', '123 Main St', 25.0, 'in_transit', datetime('now'))")
    
    cursor.execute("INSERT OR IGNORE INTO tracking_history VALUES (1, 1, 'Booked', 'Origin', datetime('now', '-2 days'))")
    cursor.execute("INSERT OR IGNORE INTO tracking_history VALUES (2, 1, 'Picked Up', 'Pickup Location', datetime('now', '-1 day'))")
    cursor.execute("INSERT OR IGNORE INTO tracking_history VALUES (3, 1, 'In Transit', 'Transit Hub', datetime('now'))")
    
    conn.commit()
    conn.close()

class CourierHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_GET(self):
        if '/api/tracking/' in self.path:
            tracking_id = self.path.split('/')[-2]
            self.handle_tracking(tracking_id)
        else:
            self.send_error(404)
    
    def do_POST(self):
        if '/api/auth/login/' in self.path:
            self.handle_login()
        elif '/api/shipments/create/' in self.path:
            self.handle_create_shipment()
        else:
            self.send_error(404)
    
    def handle_tracking(self, tracking_id):
        try:
            conn = sqlite3.connect('courier.db')
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM shipments WHERE tracking_id = ?', (tracking_id,))
            shipment = cursor.fetchone()
            
            if not shipment:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Shipment not found'}).encode())
                return
            
            cursor.execute('SELECT status, location, timestamp FROM tracking_history WHERE shipment_id = ? ORDER BY timestamp DESC', (shipment[0],))
            history = cursor.fetchall()
            
            response = {
                'tracking_number': shipment[1],
                'receiver_name': shipment[3],
                'receiver_address': shipment[5],
                'package_description': shipment[6],
                'weight': shipment[7],
                'pickup_address': shipment[8],
                'delivery_address': shipment[9],
                'cost': shipment[10],
                'status': shipment[11],
                'tracking_history': [{'status': h[0], 'location': h[1], 'timestamp': h[2]} for h in history]
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            conn.close()
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def handle_login(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        conn = sqlite3.connect('courier.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (data['username'], data['password']))
        user = cursor.fetchone()
        
        if user:
            response = {
                'access': 'fake_token',
                'refresh': 'fake_refresh',
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2],
                    'role': user[4],
                    'first_name': user[6],
                    'last_name': user[7]
                }
            }
            self.send_response(200)
        else:
            response = {'error': 'Invalid credentials'}
            self.send_response(401)
        
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())
        conn.close()
    
    def handle_create_shipment(self):
        response = {'tracking_id': 'TRK87654321', 'message': 'Shipment created successfully'}
        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())

if __name__ == '__main__':
    setup_database()
    server = HTTPServer(('127.0.0.1', 8000), CourierHandler)
    print('Server running at http://127.0.0.1:8000')
    print('Test accounts: admin/admin123, customer1/customer123')
    print('Test tracking: TRK12345678')
    server.serve_forever()