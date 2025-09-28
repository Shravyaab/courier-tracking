import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Card, CardContent, Chip } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { LocalShipping, LocationOn } from '@mui/icons-material';

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipmentData, setShipmentData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setLoading(true);
    setError('');
    setShipmentData(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
      const foundShipment = shipments.find(s => s.tracking_id === trackingId);
      
      if (foundShipment) {
        const mockData = {
          ...foundShipment,
          pickup_address: foundShipment.pickup_address,
          delivery_address: foundShipment.delivery_address,
          tracking_history: [
            {
              status: 'Package Booked',
              location: 'Origin Hub',
              timestamp: foundShipment.created_at,
              description: 'Package has been booked and is ready for pickup'
            },
            {
              status: 'In Transit',
              location: 'Distribution Center',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              description: 'Package is on its way to destination'
            }
          ]
        };
        setShipmentData(mockData);
      } else if (trackingId === 'TRK12345678') {
        setShipmentData({
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
        setError('Shipment not found. Please check your tracking ID.');
      }
    } catch (err) {
      setError('Shipment not found. Please check your tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'in_transit': return 'primary';
      case 'out_for_delivery': return 'warning';
      case 'booked': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Track Your Shipment
        </Typography>
        
        <Box component="form" onSubmit={handleTrack} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g., TRK12345678"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !trackingId.trim()}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </Box>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {shipmentData && (
          <Box>
            {/* Shipment Overview */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Tracking ID: {shipmentData.tracking_id}
                  </Typography>
                  <Chip 
                    label={shipmentData.status.replace('_', ' ')} 
                    color={getStatusColor(shipmentData.status)}
                  />
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">From:</Typography>
                    <Typography>{shipmentData.pickup_address}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">To:</Typography>
                    <Typography>{shipmentData.delivery_address}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Receiver:</Typography>
                    <Typography>{shipmentData.receiver_name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Weight:</Typography>
                    <Typography>{shipmentData.weight} kg</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            {/* Tracking History */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tracking History
                </Typography>
                
                {shipmentData.tracking_history && shipmentData.tracking_history.length > 0 ? (
                  <Timeline>
                    {shipmentData.tracking_history.map((event, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color={index === 0 ? 'primary' : 'grey'}>
                            {event.status.toLowerCase().includes('delivered') ? 
                              <LocalShipping /> : <LocationOn />
                            }
                          </TimelineDot>
                          {index < shipmentData.tracking_history.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6" component="span">
                            {event.status}
                          </Typography>
                          <Typography color="text.secondary">
                            {event.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.timestamp).toLocaleString()}
                          </Typography>
                          {event.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {event.description}
                            </Typography>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                ) : (
                  <Typography color="text.secondary">
                    No tracking history available yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TrackShipment;