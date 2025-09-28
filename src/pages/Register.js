import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem, Grid, Avatar } from '@mui/material';
import { PersonAdd, Email, Phone, Person, LocationOn, Lock } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await registerUser(data);
      setSuccess('Registration successful! Please check your email for OTP verification.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={24}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <Grid container>
            {/* Left Side - Branding */}
            <Grid item xs={12} md={5} sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center'
            }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'rgba(255,255,255,0.2)',
                mb: 3
              }}>
                <PersonAdd sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Join SwiftTrack
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                Create your account and start shipping with confidence
              </Typography>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  ✨ Fast & Reliable Delivery
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  🔒 Secure Payment Options
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  📱 Real-time Tracking
                </Typography>
                <Typography variant="body1">
                  🎯 24/7 Customer Support
                </Typography>
              </Box>
            </Grid>
            
            {/* Right Side - Form */}
            <Grid item xs={12} md={7} sx={{ p: 6 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Fill in your details to get started
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}
              
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register('first_name', { required: 'First name is required' })}
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register('last_name', { required: 'Last name is required' })}
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Username"
                  margin="normal"
                  {...register('username', { required: 'Username is required' })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <TextField
                  fullWidth
                  label="Phone"
                  margin="normal"
                  {...register('phone', { required: 'Phone is required' })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  margin="normal"
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    {...register('role', { required: 'Role is required' })}
                    error={!!errors.role}
                    label="Role"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="courier">Courier Staff</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5252, #45B7D1)'
                    },
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      style={{ 
                        color: '#667eea', 
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;