import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Card, CardContent, Grid, Rating, Tabs, Tab } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Support = () => {
  const [tabValue, setTabValue] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const ticketForm = useForm();
  const feedbackForm = useForm();

  useEffect(() => {
    if (tabValue === 1) {
      fetchTickets();
    }
  }, [tabValue]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/support/tickets/');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleCreateTicket = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post('http://127.0.0.1:8000/api/support/tickets/create/', data);
      setSuccess('Support ticket created successfully!');
      ticketForm.reset();
      fetchTickets();
    } catch (err) {
      setError('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post('http://127.0.0.1:8000/api/support/feedback/', data);
      setSuccess('Feedback submitted successfully!');
      feedbackForm.reset();
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Customer Support
      </Typography>
      
      <Paper elevation={3} sx={{ p: 0 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
          <Tab label="Create Ticket" />
          <Tab label="My Tickets" />
          <Tab label="Feedback" />
        </Tabs>
        
        <Box sx={{ p: 4 }}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {/* Create Ticket Tab */}
          {tabValue === 0 && (
            <Box component="form" onSubmit={ticketForm.handleSubmit(handleCreateTicket)}>
              <Typography variant="h6" gutterBottom>
                Create Support Ticket
              </Typography>
              
              <TextField
                fullWidth
                label="Subject"
                margin="normal"
                {...ticketForm.register('subject', { required: 'Subject is required' })}
                error={!!ticketForm.formState.errors.subject}
                helperText={ticketForm.formState.errors.subject?.message}
              />
              
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                margin="normal"
                {...ticketForm.register('description', { required: 'Description is required' })}
                error={!!ticketForm.formState.errors.description}
                helperText={ticketForm.formState.errors.description?.message}
              />
              
              <TextField
                fullWidth
                select
                label="Priority"
                margin="normal"
                SelectProps={{ native: true }}
                {...ticketForm.register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </TextField>
              
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </Button>
            </Box>
          )}
          
          {/* My Tickets Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                My Support Tickets
              </Typography>
              
              {tickets.length === 0 ? (
                <Typography color="text.secondary">
                  No tickets found.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {tickets.map((ticket) => (
                    <Grid item xs={12} key={ticket.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">
                              {ticket.subject}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  px: 1, 
                                  py: 0.5, 
                                  bgcolor: ticket.priority === 'urgent' ? 'error.light' : 'primary.light',
                                  color: 'white',
                                  borderRadius: 1
                                }}
                              >
                                {ticket.priority}
                              </Typography>
                              <Typography 
                                variant="caption"
                                sx={{ 
                                  px: 1, 
                                  py: 0.5, 
                                  bgcolor: ticket.status === 'resolved' ? 'success.light' : 'warning.light',
                                  color: 'white',
                                  borderRadius: 1
                                }}
                              >
                                {ticket.status}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {ticket.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created: {new Date(ticket.created_at).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
          
          {/* Feedback Tab */}
          {tabValue === 2 && (
            <Box component="form" onSubmit={feedbackForm.handleSubmit(handleSubmitFeedback)}>
              <Typography variant="h6" gutterBottom>
                Submit Feedback
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  {...feedbackForm.register('rating', { required: 'Rating is required' })}
                  onChange={(event, newValue) => {
                    feedbackForm.setValue('rating', newValue);
                  }}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Comments"
                multiline
                rows={4}
                margin="normal"
                {...feedbackForm.register('comment')}
                placeholder="Tell us about your experience..."
              />
              
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Support;