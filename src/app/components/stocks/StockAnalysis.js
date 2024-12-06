// components/StockAnalysis.js
import React, { useState } from 'react';
import { Button, Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import TickerInput from './TickerInput'; // Import the new component

const StockAnalysis = ({ theme }) => {

  const DisplayStockInfo = ({ data }) => {
    if (!data || !data.chart || !data.chart.result || !data.chart.result[0]) {
      return <Typography color="error">No stock data available</Typography>;
    }

    const stockInfo = data.chart.result[0].meta;

    return (
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>Stock Information</Typography>
        <Typography>Symbol: {stockInfo.symbol || 'N/A'}</Typography>
        <Typography>Currency: {stockInfo.currency || 'N/A'}</Typography>
        <Typography>Exchange: {stockInfo.exchangeName || 'N/A'}</Typography>
        <Typography>Current Price: {stockInfo.regularMarketPrice?.toFixed(2) || 'N/A'}</Typography>
        <Typography>52 Week High: {stockInfo.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}</Typography>
        <Typography>52 Week Low: {stockInfo.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}</Typography>
      </Paper>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TickerInput /> {/* Use the TickerInput component */}
      </Grid>
    </Grid>
  );
};

export default StockAnalysis;
