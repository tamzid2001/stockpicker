// components/Homepage.js
import React from 'react';
import { Paper, Typography } from "@mui/material";
import { SignInButton } from "@clerk/nextjs";
import { motion } from 'framer-motion';

const Homepage = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Stock Analysis Pro
      </Typography>
      <Typography variant="body1" paragraph>
        Get real-time stock data, earnings information, and AI-powered insights to make informed investment decisions.
      </Typography>
      <SignInButton mode="modal">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Sign In
        </motion.button>
      </SignInButton>
    </Paper>
  </motion.div>
);

export default Homepage;