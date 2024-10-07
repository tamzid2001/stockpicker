// components/StockOptions.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, CircularProgress, Box, Button } from '@mui/material';
import { useTicker } from './TickerContext'; // Import useTicker from the TickerContext

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
        const response = await fetch(`/api/stock-options?symbol=${ticker}`);
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
          <Typography variant="h6">Options Contracts</Typography>
          {options.map((option, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Expiration Date: {new Date(option.expirationDate * 1000).toLocaleDateString()}
              </Typography>
              {option.straddles.map((straddle, idx) => (
                <Paper key={idx} elevation={1} sx={{ p: 2, mt: 2 }}>
                  <Typography variant="body1"><strong>Strike Price:</strong> ${straddle.strike || 'N/A'}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Call Contract</strong></Typography>
                      <Typography variant="body2">Symbol: {straddle?.call?.contractSymbol || 'N/A'}</Typography>
                      <Typography variant="body2">Last Price: ${straddle?.call?.lastPrice || 'N/A'}</Typography>
                      <Typography variant="body2">Volume: {straddle?.call?.volume || 'N/A'}</Typography>
                      <Typography variant="body2">Open Interest: {straddle?.call?.openInterest || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Put Contract</strong></Typography>
                      <Typography variant="body2">Symbol: {straddle?.put?.contractSymbol || 'N/A'}</Typography>
                      <Typography variant="body2">Last Price: ${straddle?.put?.lastPrice || 'N/A'}</Typography>
                      <Typography variant="body2">Volume: {straddle?.put?.volume || 'N/A'}</Typography>
                      <Typography variant="body2">Open Interest: {straddle?.put?.openInterest || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default StockOptions;
