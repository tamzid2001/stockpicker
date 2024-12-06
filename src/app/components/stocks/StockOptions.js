// components/StockOptions.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, CircularProgress, Box, Button } from '@mui/material';
import { useTicker } from '../contexts/TickerContext'; // Import useTicker from the TickerContext

const StockOptions = () => {
  const { ticker } = useTicker(); // Access the global ticker from context
  const [optionsData, setOptionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptionsData = async () => {
      if (!ticker) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/options?symbol=${ticker}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.optionChain && data.optionChain.result && data.optionChain.result[0]) {
          setOptionsData(data.optionChain.result[0]);
        } else {
          throw new Error('Invalid data structure received from the API');
        }
      } catch (error) {
        console.error('Error fetching stock options data:', error);
        setError(`Error fetching stock options data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOptionsData();
  }, [ticker]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!optionsData) return null;

  const { quote, expirationDates, options } = optionsData;

  const getTopOptionsByVolume = (straddles, type) => {
    return straddles
      .map((straddle) => straddle[type])
      .filter((option) => option) // Ensure the option exists
      .sort((a, b) => b.volume - a.volume) // Sort by volume in descending order
      .slice(0, 10); // Get the top 10 by volume
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Stock Options for {quote?.shortName || 'N/A'} ({quote?.symbol || 'N/A'})</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Exchange:</strong> {quote?.exchange || 'N/A'}</Typography>
          <Typography><strong>Market Price:</strong> ${quote?.regularMarketPrice || 'N/A'}</Typography>
          <Typography><strong>52 Week Range:</strong> {quote?.fiftyTwoWeekRange || 'N/A'}</Typography>
          <Typography><strong>Market Cap:</strong> ${quote?.marketCap?.toLocaleString() || 'N/A'}</Typography>
          <Typography><strong>Currency:</strong> {quote?.currency || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Forward P/E:</strong> {quote?.forwardPE || 'N/A'}</Typography>
          <Typography><strong>Price to Book:</strong> {quote?.priceToBook || 'N/A'}</Typography>
          <Typography><strong>Volume:</strong> {quote?.regularMarketVolume?.toLocaleString() || 'N/A'}</Typography>
          <Typography><strong>Exchange Timezone:</strong> {quote?.exchangeTimezoneName || 'N/A'}</Typography>
          <Typography><strong>Market State:</strong> {quote?.marketState || 'N/A'}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Available Expiration Dates</Typography>
        {expirationDates?.map((date, index) => (
          <Button key={index} variant="outlined" size="small" sx={{ mr: 1, mt: 1 }}>
            {new Date(date * 1000).toLocaleDateString()}
          </Button>
        ))}
      </Box>

      {options && options.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Top 10 Options Contracts by Volume</Typography>
          {options.map((option, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Expiration Date: {new Date(option.expirationDate * 1000).toLocaleDateString()}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom><strong>Top 10 Calls by Volume:</strong></Typography>
                {getTopOptionsByVolume(option.straddles, 'call').map((callOption, idx) => (
                  <Paper key={idx} elevation={1} sx={{ p: 2, mt: 1 }}>
                    <Typography variant="body2">Symbol: {callOption?.contractSymbol || 'N/A'}</Typography>
                    <Typography variant="body2">Strike Price: ${callOption?.strike || 'N/A'}</Typography>
                    <Typography variant="body2">Last Price: ${callOption?.lastPrice || 'N/A'}</Typography>
                    <Typography variant="body2">Volume: {callOption?.volume || 'N/A'}</Typography>
                    <Typography variant="body2">Open Interest: {callOption?.openInterest || 'N/A'}</Typography>
                  </Paper>
                ))}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom><strong>Top 10 Puts by Volume:</strong></Typography>
                {getTopOptionsByVolume(option.straddles, 'put').map((putOption, idx) => (
                  <Paper key={idx} elevation={1} sx={{ p: 2, mt: 1 }}>
                    <Typography variant="body2">Symbol: {putOption?.contractSymbol || 'N/A'}</Typography>
                    <Typography variant="body2">Strike Price: ${putOption?.strike || 'N/A'}</Typography>
                    <Typography variant="body2">Last Price: ${putOption?.lastPrice || 'N/A'}</Typography>
                    <Typography variant="body2">Volume: {putOption?.volume || 'N/A'}</Typography>
                    <Typography variant="body2">Open Interest: {putOption?.openInterest || 'N/A'}</Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default StockOptions;
