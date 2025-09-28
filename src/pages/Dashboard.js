import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/shipments/list/');
      setShipments(response.data);
      
      // Calculate stats
      const totalShipments = response.data.length;
      const delivered = response.data.filter(s => s.status === 'delivered').length;
      const inTransit = response.data.filter(s => s.status === 'in_transit').length;
      const pending = response.data.filter(s => s.status === 'booked').length;
      
      setStats({ totalShipments, delivered, inTransit, pending });
    } catch (error) {
      console.error('Error fetching shipments:', error);
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

  const updateShipmentStatus = async (shipmentId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/shipments/${shipmentId}/update-status/`, {
        status: newStatus,
        location: 'Updated by courier',
        description: `Status updated to ${newStatus}`
      });
      fetchShipments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard - {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Shipments
              </Typography>
              <Typography variant="h4">
                {stats.totalShipments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Delivered
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.delivered || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Transit
              </Typography>
              <Typography variant="h4" color="primary.main">
                {stats.inTransit || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pending || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Shipments Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {user?.role === 'customer' ? 'My Shipments' : 'Assigned Shipments'}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tracking ID</TableCell>
                  <TableCell>Receiver</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Created</TableCell>
                  {user?.role === 'courier' && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>{shipment.tracking_id}</TableCell>
                    <TableCell>{shipment.receiver_name}</TableCell>
                    <TableCell>{shipment.delivery_address}</TableCell>
                    <TableCell>
                      <Chip 
                        label={shipment.status.replace('_', ' ')} 
                        color={getStatusColor(shipment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${shipment.cost}</TableCell>
                    <TableCell>{new Date(shipment.created_at).toLocaleDateString()}</TableCell>
                    {user?.role === 'courier' && (
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {shipment.status === 'booked' && (
                            <Button 
                              size="small" 
                              onClick={() => updateShipmentStatus(shipment.id, 'picked_up')}
                            >
                              Pick Up
                            </Button>
                          )}
                          {shipment.status === 'picked_up' && (
                            <Button 
                              size="small" 
                              onClick={() => updateShipmentStatus(shipment.id, 'in_transit')}
                            >
                              In Transit
                            </Button>
                          )}
                          {shipment.status === 'in_transit' && (
                            <Button 
                              size="small" 
                              onClick={() => updateShipmentStatus(shipment.id, 'out_for_delivery')}
                            >
                              Out for Delivery
                            </Button>
                          )}
                          {shipment.status === 'out_for_delivery' && (
                            <Button 
                              size="small" 
                              color="success"
                              onClick={() => updateShipmentStatus(shipment.id, 'delivered')}
                            >
                              Delivered
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;