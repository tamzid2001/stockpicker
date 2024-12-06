// components/homepage/HeroSection.js
import React from 'react';
import { Box, Container, Typography, Button } from "@mui/material";
import { SignInButton } from "@clerk/nextjs";
import { motion } from 'framer-motion';

const HeroSection = () => (
  <Box 
    sx={{ 
      bgcolor: 'primary.main', 
      color: 'primary.contrastText', 
      py: 8,
      background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
    }}
  >
    <Container maxWidth="md">
      <Typography
        component={motion.h1}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        variant="h2" 
        align="center" 
        gutterBottom
      >
        Welcome to Stock Analysis Pro
      </Typography>
      <Typography
        component={motion.p}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        variant="h5" 
        align="center" 
        paragraph
      >
        Harness the power of AI for smarter investment decisions
      </Typography>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <SignInButton mode="modal">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="contained" color="secondary" size="large">
              Get Started
            </Button>
          </motion.div>
        </SignInButton>
      </Box>
    </Container>
  </Box>
);

export default HeroSection;