// components/StockFundamentals.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useTicker } from '../contexts/TickerContext'; // Import useTicker from the TickerContext

const StockFundamentals = () => {
  const { ticker } = useTicker();
  const [fundamentals, setFundamentals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundamentals = async () => {
      if (!ticker) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/fundamentals?symbol=${ticker}`);
        const data = await response.json();
        setFundamentals(data.quoteSummary.result[0]);
      } catch (error) {
        console.error('Error fetching fundamentals:', error);
        setError('Error fetching fundamentals. Please try again.');
      }
      setLoading(false);
    };

    fetchFundamentals();
  }, [ticker]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!fundamentals) return null;

  const { assetProfile, summaryProfile } = fundamentals;

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Company Fundamentals</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Company Profile</Typography>
          <Typography><strong>Address:</strong> {assetProfile.address1}, {assetProfile.city}, {assetProfile.country}</Typography>
          <Typography><strong>Website:</strong> <a href={assetProfile.website} target="_blank" rel="noopener noreferrer">{assetProfile.website}</a></Typography>
          <Typography><strong>Sector:</strong> {assetProfile.sector}</Typography>
          <Typography><strong>Industry:</strong> {assetProfile.industry}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Company Summary</Typography>
          <Typography>{summaryProfile.longBusinessSummary}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Key Officers</Typography>
          <List>
            {assetProfile.companyOfficers.slice(0, 5).map((officer, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={officer.name}
                  secondary={`${officer.title} ${officer.age ? `| Age: ${officer.age}` : ''} ${officer.totalPay ? `| Total Pay: $${officer.totalPay.fmt}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StockFundamentals;