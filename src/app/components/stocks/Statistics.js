// components/StockStatistics.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, CircularProgress } from '@mui/material';
import { useTicker } from '../contexts/TickerContext'; // Import useTicker from the TickerContext

const StockStatistics = () => {
  const { ticker } = useTicker();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!ticker) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/statistics?symbol=${ticker}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.quoteSummary && data.quoteSummary.result && data.quoteSummary.result[0]) {
          setStatistics(data.quoteSummary.result[0].defaultKeyStatistics);
        } else {
          throw new Error('Invalid data structure received from the API');
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(`Error fetching statistics: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [ticker]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!statistics) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Stock Statistics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Enterprise Value:</strong> {statistics.enterpriseValue?.fmt || 'N/A'}</Typography>
          <Typography><strong>Forward P/E:</strong> {statistics.forwardPE?.fmt || 'N/A'}</Typography>
          <Typography><strong>Profit Margins:</strong> {statistics.profitMargins?.fmt || 'N/A'}</Typography>
          <Typography><strong>Shares Outstanding:</strong> {statistics.sharesOutstanding?.fmt || 'N/A'}</Typography>
          <Typography><strong>Float Shares:</strong> {statistics.floatShares?.fmt || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Held by Insiders:</strong> {statistics.heldPercentInsiders?.fmt || 'N/A'}</Typography>
          <Typography><strong>Held by Institutions:</strong> {statistics.heldPercentInstitutions?.fmt || 'N/A'}</Typography>
          <Typography><strong>Short % of Float:</strong> {statistics.shortPercentOfFloat?.fmt || 'N/A'}</Typography>
          <Typography><strong>Beta:</strong> {statistics.beta?.fmt || 'N/A'}</Typography>
          <Typography><strong>52 Week Change:</strong> {statistics['52WeekChange']?.fmt || 'N/A'}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StockStatistics;