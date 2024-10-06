// components/homepage/FeatureCards.js
import React from 'react';
import { Container, Typography, Grid, Paper, CardContent } from "@mui/material";
import { motion } from 'framer-motion';
import { 
  TrendingUp, Timeline, ChatBubble, Insights, 
  NewReleases, Assessment
} from '@mui/icons-material';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Paper 
    component={motion.div}
    elevation={3}
    whileHover={{ scale: 1.03 }}
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: '15px',
      overflow: 'hidden',
    }}
  >
    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
      <Icon sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
      <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
    </CardContent>
  </Paper>
);

const FeatureCards = () => (
  <Container sx={{ py: 8 }} maxWidth="lg">
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={TrendingUp} 
          title="Real-Time Analytics" 
          description="Stay ahead with lightning-fast data updates and current stock trends for confident decision-making."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={Timeline} 
          title="Advanced Charting" 
          description="Visualize complex stock patterns with state-of-the-art tools for comprehensive market analysis."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={ChatBubble} 
          title="AI Assistant" 
          description="Get 24/7 expert advice and answers to your investment queries from our AI-powered assistant."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={Insights} 
          title="Predictive Insights" 
          description="Leverage AI-driven forecasts to anticipate market trends and position your portfolio for success."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={NewReleases} 
          title="Breaking News" 
          description="Stay informed with our AI-curated news feed, bringing you market-moving information in real-time."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FeatureCard 
          icon={Assessment} 
          title="Portfolio Analysis" 
          description="Gain comprehensive insights into your investments with AI-powered risk assessment and optimization tools."
        />
      </Grid>
    </Grid>
  </Container>
);

export default FeatureCards;