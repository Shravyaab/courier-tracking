import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Grid, Avatar, Divider } from '@mui/material';
import { Login as LoginIcon, Person, Lock, Speed } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
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
            {/* Left Side - Form */}
            <Grid item xs={12} md={7} sx={{ p: 6 }}>
              <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'transparent',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  mb: 3,
                  mx: 'auto'
                }}>
                  <LoginIcon sx={{ fontSize: 30 }} />
                </Avatar>
                
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  align="center"
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                  Sign in to your SwiftTrack account
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    {...register('username', { required: 'Username is required' })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      mt: 4, 
                      mb: 3,
                      py: 1.8,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                      },
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                      textTransform: 'none'
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      New to SwiftTrack?
                    </Typography>
                  </Divider>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/register"
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#5a6fd8',
                        bgcolor: 'rgba(102, 126, 234, 0.04)'
                      },
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    Create New Account
                  </Button>
                </Box>
              </Box>
            </Grid>
            
            {/* Right Side - Branding */}
            <Grid item xs={12} md={5} sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
              p: 6,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>
                  SwiftTrack
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.4 }}>
                  Your trusted partner for fast, secure, and reliable courier services
                </Typography>
                
                <Box sx={{ textAlign: 'left', maxWidth: 300 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Speed sx={{ mr: 2 }} />
                    <Typography variant="body1">
                      Lightning-fast delivery
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Lock sx={{ mr: 2 }} />
                    <Typography variant="body1">
                      Secure & encrypted
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 2 }} />
                    <Typography variant="body1">
                      Trusted by thousands
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;