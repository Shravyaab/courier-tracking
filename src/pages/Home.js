import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Paper, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { LocalShipping, TrackChanges, Payment, Support, Speed, Security, LocationOn, Schedule } from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <LocalShipping fontSize="large" />,
      title: 'Easy Shipping',
      description: 'Create and manage shipments with just a few clicks',
      color: '#FF6B6B'
    },
    {
      icon: <TrackChanges fontSize="large" />,
      title: 'Real-time Tracking',
      description: 'Track your packages in real-time with GPS location',
      color: '#4ECDC4'
    },
    {
      icon: <Payment fontSize="large" />,
      title: 'Multiple Payment Options',
      description: 'Pay online or choose cash on delivery',
      color: '#45B7D1'
    },
    {
      icon: <Support fontSize="large" />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our support system',
      color: '#96CEB4'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Packages Delivered' },
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '99.9%', label: 'Success Rate' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
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
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Chip 
              label="🚀 Fast & Reliable Delivery" 
              sx={{ 
                mb: 3, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '1rem',
                px: 2,
                py: 1
              }} 
            />
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFE066, #FF6B6B)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              SwiftTrack
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 300,
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1.2rem', md: '1.8rem' }
              }}
            >
              Your Package, Our Priority - Delivered with Excellence
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/track"
                startIcon={<LocationOn />}
                sx={{ 
                  bgcolor: '#FF6B6B',
                  '&:hover': { bgcolor: '#FF5252' },
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
                }}
              >
                Track Package
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/register"
                startIcon={<Speed />}
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        <Paper 
          elevation={24}
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
          }}
        >
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'white',
              mb: 2
            }}
          >
            Why Choose SwiftTrack?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, mx: 'auto' }}>
            Experience the future of courier services with our cutting-edge technology and unmatched reliability
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box 
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: 'white',
                      boxShadow: `0 8px 32px ${feature.color}40`
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', py: 6, mt: 4 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
              Ready to Ship with Confidence?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
              Join thousands of satisfied customers who trust SwiftTrack for their delivery needs
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              startIcon={<Schedule />}
              sx={{ 
                bgcolor: '#4ECDC4',
                '&:hover': { bgcolor: '#45B7D1' },
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.2rem',
                boxShadow: '0 8px 32px rgba(78, 205, 196, 0.3)'
              }}
            >
              Start Shipping Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;