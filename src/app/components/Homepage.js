// components/Homepage.js
import React from 'react';
import { Box } from "@mui/material";
import HeroSection from './homepage/HeroSection';
import FeatureCards from './homepage/FeatureCards';
import VideoSection from './homepage/VideoSection';
import WaitingList from './homepage/WaitingList';
import UserReviews from './homepage/UserReviews';

const Homepage = () => (
  <Box sx={{ bgcolor: 'background.default' }}>
    <HeroSection />
    <FeatureCards />
    <VideoSection />
    <WaitingList />
    <UserReviews />
  </Box>
);

export default Homepage;