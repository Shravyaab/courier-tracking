import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const CreateShipment = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const weight = watch('weight');
  const estimatedCost = weight ? (parseFloat(weight) * 10).toFixed(2) : '0.00';

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate tracking ID
      const trackingId = 'TRK' + Date.now().toString().slice(-8);
      
      // Create shipment object
      const shipment = {
        id: Date.now(),
        tracking_id: trackingId,
        ...data,
        status: 'booked',
        created_at: new Date().toISOString(),
        estimated_cost: estimatedCost
      };
      
      // Save to localStorage
      const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
      shipments.push(shipment);
      localStorage.setItem('shipments', JSON.stringify(shipments));
      
      setSuccess(`Shipment created successfully! Tracking ID: ${trackingId}`);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError('Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Shipment
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Receiver Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Receiver Name"
                margin="normal"
                {...register('receiver_name', { required: 'Receiver name is required' })}
                error={!!errors.receiver_name}
                helperText={errors.receiver_name?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Receiver Phone"
                margin="normal"
                {...register('receiver_phone', { required: 'Receiver phone is required' })}
                error={!!errors.receiver_phone}
                helperText={errors.receiver_phone?.message}
              />
            </Grid>
          </Grid>
          
          <TextField
            fullWidth
            label="Receiver Address"
            multiline
            rows={3}
            margin="normal"
            {...register('receiver_address', { required: 'Receiver address is required' })}
            error={!!errors.receiver_address}
            helperText={errors.receiver_address?.message}
          />
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Package Information
          </Typography>
          
          <TextField
            fullWidth
            label="Package Description"
            multiline
            rows={2}
            margin="normal"
            {...register('package_description', { required: 'Package description is required' })}
            error={!!errors.package_description}
            helperText={errors.package_description?.message}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                step="0.1"
                margin="normal"
                {...register('weight', { 
                  required: 'Weight is required',
                  min: { value: 0.1, message: 'Weight must be at least 0.1 kg' }
                })}
                error={!!errors.weight}
                helperText={errors.weight?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dimensions (L x W x H cm)"
                margin="normal"
                {...register('dimensions')}
              />
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Addresses
          </Typography>
          
          <TextField
            fullWidth
            label="Pickup Address"
            multiline
            rows={2}
            margin="normal"
            {...register('pickup_address', { required: 'Pickup address is required' })}
            error={!!errors.pickup_address}
            helperText={errors.pickup_address?.message}
          />
          
          <TextField
            fullWidth
            label="Delivery Address"
            multiline
            rows={2}
            margin="normal"
            {...register('delivery_address', { required: 'Delivery address is required' })}
            error={!!errors.delivery_address}
            helperText={errors.delivery_address?.message}
          />
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Payment Information
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Method</InputLabel>
            <Select
              {...register('payment_method', { required: 'Payment method is required' })}
              error={!!errors.payment_method}
              label="Payment Method"
            >
              <MenuItem value="cod">Cash on Delivery</MenuItem>
              <MenuItem value="card">Credit/Debit Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="wallet">Digital Wallet</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6">
              Estimated Cost: ${estimatedCost}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cost is calculated at $10 per kg
            </Typography>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Creating Shipment...' : 'Create Shipment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateShipment;