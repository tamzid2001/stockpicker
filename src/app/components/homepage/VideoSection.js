// components/homepage/VideoSection.js
import React from 'react';
import { Box, Container, Typography } from "@mui/material";

const VideoSection = () => (
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
);

export default VideoSection;