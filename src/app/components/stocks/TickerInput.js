// components/stocks/TickerInput.js
import React from 'react';
import { TextField, Box, Chip } from '@mui/material';
import { useTicker } from '../contexts/TickerContext';

const suggestedTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'JNJ'];

const TickerInput = () => {
  const { ticker, setTicker } = useTicker();

  return (
    <Box sx={{ mb: 2 }}>
      <TextField 
        fullWidth 
        label="Enter Stock Ticker" 
        value={ticker} 
        onChange={(e) => setTicker(e.target.value.toUpperCase())} 
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {suggestedTickers.map((suggestedTicker) => (
          <Chip
            key={suggestedTicker}
            label={suggestedTicker}
            onClick={() => setTicker(suggestedTicker)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default TickerInput;
