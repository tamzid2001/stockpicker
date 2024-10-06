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
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiFormLabel-asterisk': {
            color: 'error.main',
          },
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
      >
        Join Waiting List
      </Button>
    </Box>
  </Container>
);

export default WaitingList;