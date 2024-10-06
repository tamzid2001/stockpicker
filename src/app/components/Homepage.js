// components/Homepage.js
import React from 'react';
import { 
  Box, Container, Typography, Button, Grid, Card, CardContent, 
  TextField, Avatar, Rating, Paper
} from "@mui/material";
import { SignInButton } from "@clerk/nextjs";
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
      <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
      <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
    </CardContent>
  </Paper>
);

const UserReview = ({ name, role, review, rating }) => (
  <Box sx={{ textAlign: 'center', mb: 4 }}>
    <Avatar sx={{ width: 60, height: 60, margin: 'auto', mb: 2 }}>{name[0]}</Avatar>
    <Typography variant="h6">{name}</Typography>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {role}
    </Typography>
    <Rating value={rating} readOnly />
    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
      "{review}"
    </Typography>
  </Box>
);

const Homepage = () => (
  <Box sx={{ bgcolor: 'background.default' }}>
    {/* Hero Section */}
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

    {/* Feature Cards */}
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard 
            icon={TrendingUp} 
            title="Real-Time Analytics" 
            description="Stay ahead of the market with our lightning-fast data updates. Our real-time analytics provide you with the most current stock trends, enabling you to make split-second decisions with confidence. From price movements to volume changes, get the pulse of the market at your fingertips."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard 
            icon={Timeline} 
            title="Advanced Charting" 
            description="Dive deep into market data with our state-of-the-art charting tools. Visualize complex stock patterns, identify key support and resistance levels, and overlay multiple indicators to gain a comprehensive view of market dynamics. Our interactive charts empower you to uncover hidden trends and make informed decisions."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard 
            icon={ChatBubble} 
            title="AI Assistant" 
            description="Meet your personal market expert. Our AI assistant is available 24/7 to answer your investment queries, explain complex market phenomena, and provide tailored advice based on your portfolio. It's like having a seasoned analyst by your side, ready to assist you at any moment."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard 
            icon={Insights} 
            title="Predictive Insights" 
            description="Peer into the future of the markets with our AI-driven predictive insights. By analyzing vast amounts of historical data and current market conditions, our advanced algorithms provide you with potential market scenarios and trend forecasts. Stay one step ahead and position your portfolio for success."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard 
            icon={NewReleases} 
            title="Breaking News" 
            description="Never miss a beat with our curated news feed. Our AI scans thousands of sources to bring you the most relevant and impactful market news in real-time. From earnings reports to geopolitical events, stay informed about everything that could affect your investments."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard 
            icon={Assessment} 
            title="Portfolio Analysis" 
            description="Gain a 360-degree view of your investments with our comprehensive portfolio analysis tools. Assess risk, track performance, and identify optimization opportunities at a glance. Our AI-powered insights help you balance your portfolio for maximum returns while aligning with your risk tolerance."
          />
        </Grid>
      </Grid>
    </Container>

    {/* Video Section */}
    <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          See Stock Analysis Pro in Action
        </Typography>
        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', mt: 4 }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Stock Analysis Pro Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Container>
    </Box>

    {/* Waiting List */}
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

    {/* User Reviews */}
    <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          What Our Users Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <UserReview 
              name="John Doe"
              role="Day Trader"
              review="Stock Analysis Pro has revolutionized my trading strategy. The AI insights are invaluable!"
              rating={5}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserReview 
              name="Jane Smith"
              role="Investment Analyst"
              review="The real-time data and advanced charting tools have significantly improved my analysis process."
              rating={4.5}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserReview 
              name="Mike Johnson"
              role="Retail Investor"
              review="As a beginner, the AI assistant has been incredibly helpful in understanding market trends."
              rating={5}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </Box>
);

export default Homepage;