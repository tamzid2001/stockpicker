import React, { useState } from 'react';
import { Container, Box, TextField, Typography, Button, Paper, Avatar } from '@mui/material';
import { Email, Person, Subject, Message } from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a mailto link with the form data
    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:tullah@nyit.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    // Open the mail client
    window.location.href = mailtoLink;
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
            <Email />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We'd love to hear from you! Fill out the form below and we'll get back to you soon.
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person color="primary" />
            <TextField
              variant="outlined"
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Email color="primary" />
            <TextField
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Subject color="primary" />
            <TextField
              variant="outlined"
              label="Subject"
              name="subject"
              fullWidth
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Message color="primary" />
            <TextField
              variant="outlined"
              label="Message"
              name="message"
              multiline
              rows={4}
              fullWidth
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}
          >
            Send Message
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;
