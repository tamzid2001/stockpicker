// components/homepage/FeatureCards.js
import React from 'react';
import { Container, Typography, Grid, Paper, CardContent, Box } from "@mui/material";
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import InsightsIcon from '@mui/icons-material/Insights';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Individual Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <Paper 
    component={motion.div}
    elevation={5}
    whileHover={{ scale: 1.05 }}
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderRadius: '15px',
      p: 3,
      height: '100%',
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s ease',
      backgroundColor: 'background.paper',
    }}
  >
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
      <Icon sx={{ width: '100%', height: '100%', color: 'primary.main' }} />
    </Box>
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Paper>
);

// Feature Cards Component containing multiple FeatureCard instances
const FeatureCards = () => (
  <Container sx={{ py: 8 }} maxWidth="lg">
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={TrendingUpIcon}
          title="Real-Time Analytics" 
          description="Stay ahead with lightning-fast data updates and current stock trends for confident decision-making."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={TimelineIcon}
          title="Advanced Charting" 
          description="Visualize complex stock patterns with state-of-the-art tools for comprehensive market analysis."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={ChatBubbleIcon}
          title="AI Assistant" 
          description="Get 24/7 expert advice and answers to your investment queries from our AI-powered assistant."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={InsightsIcon}
          title="Predictive Insights" 
          description="Leverage AI-driven forecasts to anticipate market trends and position your portfolio for success."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={NewReleasesIcon}
          title="Breaking News" 
          description="Stay informed with our AI-curated news feed, bringing you market-moving information in real-time."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={AssessmentIcon}
          title="Portfolio Analysis" 
          description="Gain comprehensive insights into your investments with AI-powered risk assessment and optimization tools."
        />
      </Grid>
    </Grid>
  </Container>
);

export default FeatureCards;
