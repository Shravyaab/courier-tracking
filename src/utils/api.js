const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const trackPackage = async (trackingNumber) => {
  const response = await fetch(`${API_BASE_URL}/tracking/${trackingNumber}/`);
  
  if (!response.ok) {
    throw new Error('Package not found');
  }
  
  const data = await response.json();
  
  // Transform response to match frontend format
  return {
    trackingNumber: data.tracking_number,
    status: data.status,
    origin: data.pickup_address,
    destination: data.delivery_address,
    estimatedDelivery: '2024-01-15',
    history: data.tracking_history ? data.tracking_history.map(item => ({
      status: item.status,
      location: item.location,
      timestamp: new Date(item.timestamp).toLocaleString()
    })) : []
  };
};

export const createPackage = async (packageData) => {
  const response = await fetch(`${API_BASE_URL}/shipments/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(packageData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create package');
  }
  
  return response.json();
};