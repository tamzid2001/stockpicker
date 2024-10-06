// components/homepage/WaitingList.js
import React from 'react';
import { Container, Typography, Box, TextField, Button } from "@mui/material";

const WaitingList = () => (
  <Container maxWidth="sm" sx={{ py: 8 }}>
    <Typography variant="h4" align="center" gutterBottom>
      Join the Waiting List
    </Typography>
    <Typography variant="body1" align="center" paragraph>
      Be the first to know when we launch new features. Sign up for our waiting list!
    </Typography>
    <Box 
      component="form" 
      noValidate 
      sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onSubmit={(e) => e.preventDefault()} // Prevent form submission for now
    >
      <TextField
        variant="outlined"
        placeholder="Enter your email"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
      >
        Join Waiting List
      </Button>
    </Box>
  </Container>
);

export default WaitingList;
