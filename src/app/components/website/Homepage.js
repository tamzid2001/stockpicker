// components/Homepage.js
import React, { Suspense, lazy } from 'react';
import { Box, Typography, CircularProgress } from "@mui/material";
import ErrorBoundary from './ErrorBoundary';
import HeroSection from '../homepage/HeroSection';
import FeatureCards from '../homepage/FeatureCards';
import VideoSection from '../homepage/VideoSection';
import WaitingList from '../homepage/WaitingList';
import UserReviews from '../homepage/UserReviews';

// Lazy load About and Contact components
const About = lazy(() => import('../website/About'));
const Contact = lazy(() => import('../website/Contact'));

function LoadingFallback() {
  return <CircularProgress />;
}

const Homepage = () => (
  <Box sx={{ bgcolor: 'background.default' }}>
    <ErrorBoundary fallback={<Typography color="error">Error loading hero section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading about section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <About />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading contact section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <Contact />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading feature cards</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <FeatureCards />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading video section</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <VideoSection />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading waiting list</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <WaitingList />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary fallback={<Typography color="error">Error loading user reviews</Typography>}>
      <Suspense fallback={<LoadingFallback />}>
        <UserReviews />
      </Suspense>
    </ErrorBoundary>
  </Box>
);

export default Homepage;
