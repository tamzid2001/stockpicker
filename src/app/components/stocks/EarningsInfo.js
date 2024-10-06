// components/EarningsInfo.js
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

const EarningsInfo = () => {
  const { ticker } = useTicker();
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!ticker) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/earnings?symbol=${ticker}`);
        const data = await response.json();
        setEarningsData(data);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        setError('Error fetching earnings data. Please try again.');
      }
      setLoading(false);
    };

    fetchEarningsData();
  }, [ticker]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!earningsData || !earningsData.quoteSummary || !earningsData.quoteSummary.result || !earningsData.quoteSummary.result[0] || !earningsData.quoteSummary.result[0].earnings) {
    return <Typography color="error">No earnings data available</Typography>;
  }

  const earningsInfo = earningsData.quoteSummary.result[0].earnings;

  return (
    <Paper elevation={3} className="p-4">
      <Typography variant="h6" gutterBottom>Earnings Information</Typography>
      <Typography variant="subtitle1" gutterBottom>Quarterly Earnings</Typography>
      {earningsInfo.earningsChart.quarterly.map((quarter, index) => (
        <Box key={index} mb={1}>
          <Typography>
            {quarter.date}: Actual ${quarter.actual.fmt} vs Estimate ${quarter.estimate.fmt}
          </Typography>
        </Box>
      ))}
      <Typography variant="subtitle1" gutterBottom className="mt-4">Financial Yearly Data</Typography>
      {earningsInfo.financialsChart.yearly.map((year, index) => (
        <Box key={index} mb={1}>
          <Typography>
            {year.date}: Revenue ${year.revenue.fmt}, Earnings ${year.earnings.fmt}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default EarningsInfo;