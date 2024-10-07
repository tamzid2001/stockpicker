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

import { useTicker } from '../contexts/TickerContext';
import TickerInput from './TickerInput'; // Import the new component

const StockAnalysis = ({ theme }) => {
  const { ticker } = useTicker(); // Use the ticker from context
  const [stockData, setStockData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!ticker) {
      setError('Please enter a stock ticker');
      return;
    }

    setLoading(true);
    setError(null);
    setStockData(null);
    setGraphData(null);

    try {
      const response = await fetch(`/api/stock?symbol=${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      setStockData(data);
      
      if (data.chart && data.chart.result && data.chart.result[0]) {
        const result = data.chart.result[0];
        const timestamps = result.timestamp || [];
        const closePrices = result.indicators.quote[0].close || [];

        const dataLimit = 50;
        const step = Math.ceil(timestamps.length / dataLimit);

        setGraphData({
          labels: timestamps.filter((_, index) => index % step === 0).map(ts => new Date(ts * 1000).toLocaleDateString()),
          datasets: [{
            label: 'Stock Price',
            data: closePrices.filter((_, index) => index % step === 0),
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            tension: 0.1
          }]
        });
      } else {
        setError('Invalid data structure received from the stock API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
        <Paper elevation={3} sx={{ p: 4 }}>
          <TickerInput /> {/* Use the TickerInput component */}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchData} 
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Stock'}
          </Button>
        </Paper>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText' }}>
            <Typography>{error}</Typography>
          </Paper>
        </Grid>
      )}

      {stockData && (
        <>
          <Grid item xs={12} md={6}>
            <DisplayStockInfo data={stockData} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>Stock Graph</Typography>
              {graphData ? (
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={graphData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          type: 'category',
                          ticks: {
                            maxTicksLimit: 10
                          }
                        },
                        y: {
                          type: 'linear',
                          beginAtZero: false
                        }
                      }
                    }} 
                  />
                </Box>
              ) : (
                <Typography color="error">No graph data available</Typography>
              )}
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default StockAnalysis;
