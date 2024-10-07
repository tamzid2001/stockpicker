// components/LoadingFallback.js

import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingFallback = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        flexDirection: 'column',
      }}
    >
      <CircularProgress />
      <Box mt={2}>
        <p>Loading, please wait...</p>
      </Box>
    </Box>
  );
};

export default LoadingFallback;
