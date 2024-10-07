// componenets/website/about.js
import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { TrendingUp, Insights, Assessment } from '@mui/icons-material';

const About = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main' }}>
        Transforming the Way You Invest
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" paragraph>
          At <strong>StockMaster</strong>, we are redefining how investors interact with the market. Our mission is simple: to empower individuals and businesses with cutting-edge tools and insights to make smarter, data-driven investment decisions.
        </Typography>
        <Typography variant="body1" paragraph>
          With our advanced AI technology, real-time analytics, and expert market analysis, we bring Wall Street expertise to your fingertips, making stock trading accessible for everyone, whether you're a seasoned trader or just getting started.
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform is designed with one goal in mind—your success. We prioritize innovation, accuracy, and user experience, ensuring that every feature is tailored to help you stay ahead of market trends and optimize your portfolio.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 2 }}>
          Why Choose StockMaster?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TrendingUp fontSize="large" color="primary" />
          <Typography variant="body1">
            <strong>Real-Time Insights</strong> - Access the latest market data and trends, updated in real-time, so you can make informed decisions with confidence.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Insights fontSize="large" color="secondary" />
          <Typography variant="body1">
            <strong>AI-Powered Analysis</strong> - Leverage the power of artificial intelligence to get personalized stock recommendations, portfolio insights, and market forecasts.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Assessment fontSize="large" color="primary" />
          <Typography variant="body1">
            <strong>Comprehensive Tools</strong> - From advanced charting and stock screeners to earnings analysis and risk management, we provide all the tools you need to succeed.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
          Join Us on the Journey to Financial Success
        </Typography>
        <Typography variant="body1" paragraph>
          We believe that with the right tools, anyone can become a successful investor. At StockMaster, we are committed to leveling the playing field by providing our users with the most powerful and user-friendly stock analysis platform available.
        </Typography>
        <Typography variant="body1" paragraph>
          Whether you want to explore the latest market opportunities, optimize your portfolio, or simply learn more about stock trading, StockMaster is your partner in navigating the financial markets.
        </Typography>
      </Box>
    </Paper>
  </Container>
);

export default About;
