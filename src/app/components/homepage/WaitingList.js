// components/homepage/WaitingList.js
import React from 'react';
import { Container, Typography, Box } from "@mui/material";
import { Input, Button } from '@mui/joy';

const WaitingList = () => (
  <Container maxWidth="sm" sx={{ py: 8 }}>
    <Typography variant="h4" align="center" gutterBottom>
      Join the Waiting List
    </Typography>
    <Typography variant="body1" align="center" paragraph>
      Be the first to know when we launch new features. Sign up for our waiting list!
    </Typography>
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <Input
        placeholder="Enter your email"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        fullWidth
        color="primary"
        size="lg"
      >
        Join Waiting List
      </Button>
    </Box>
  </Container>
);

export default WaitingList;