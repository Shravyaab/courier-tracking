const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock users database
let users = [];
let currentUserId = 1;

// Register endpoint
app.post('/api/auth/register/', (req, res) => {
  const { username, email, password, first_name, last_name, phone, address, role } = req.body;
  
  // Check if user exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ username: ['Username already exists'] });
  }
  
  const newUser = {
    id: currentUserId++,
    username,
    email,
    first_name,
    last_name,
    phone,
    address,
    role: role || 'customer'
  };
  
  users.push(newUser);
  res.status(201).json({ message: 'Registration successful' });
});

// Login endpoint
app.post('/api/auth/login/', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ non_field_errors: ['Invalid credentials'] });
  }
  
  res.json({
    access: 'mock-token-' + Date.now(),
    refresh: 'mock-refresh-token',
    user: user
  });
});

// Track shipment endpoint
app.get('/api/tracking/:trackingId/', (req, res) => {
  const { trackingId } = req.params;
  
  if (trackingId === 'TRK12345678') {
    res.json({
      tracking_id: trackingId,
      status: 'in_transit',
      pickup_address: '123 Main St, City A',
      delivery_address: '456 Oak Ave, City B',
      receiver_name: 'John Doe',
      weight: 2.5,
      tracking_history: [
        {
          status: 'Delivered',
          location: 'City B Distribution Center',
          timestamp: new Date().toISOString(),
          description: 'Package delivered successfully'
        },
        {
          status: 'Out for Delivery',
          location: 'City B Local Hub',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          description: 'Package out for delivery'
        }
      ]
    });
  } else {
    res.status(404).json({ error: 'Shipment not found' });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Mock backend running on http://127.0.0.1:${PORT}`);
});