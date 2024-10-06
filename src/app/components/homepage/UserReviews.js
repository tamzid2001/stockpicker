// components/homepage/UserReviews.js
import React from 'react';
import { Box, Container, Typography, Grid, Avatar, Rating } from "@mui/material";

const UserReview = ({ name, role, review, rating, image }) => (
  <Box sx={{ textAlign: 'center', mb: 4 }}>
    <Avatar 
      sx={{ width: 80, height: 80, margin: 'auto', mb: 2 }}
      src={image}
      alt={name}
    >
      {!image && name[0]}
    </Avatar>
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

const UserReviews = () => (
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
            image="/path/to/john-doe-image.jpg"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <UserReview 
            name="Jane Smith"
            role="Investment Analyst"
            review="The real-time data and advanced charting tools have significantly improved my analysis process."
            rating={4.5}
            image="/path/to/jane-smith-image.jpg"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <UserReview 
            name="Mike Johnson"
            role="Retail Investor"
            review="As a beginner, the AI assistant has been incredibly helpful in understanding market trends."
            rating={5}
            image="/path/to/mike-johnson-image.jpg"
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default UserReviews;