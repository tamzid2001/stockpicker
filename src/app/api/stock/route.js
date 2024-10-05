'use client'

import React, { useState, useEffect } from 'react';
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgress, AppBar, Toolbar, Typography, Container, TextField, Button, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stock?symbol=${ticker}`);
      const data = await response.json();
      setStockData(data);
      
      if (data.chart && data.chart.result && data.chart.result[0]) {
        const result = data.chart.result[0];
        const timestamps = result.timestamp || [];
        const closePrices = result.indicators.quote[0].close || [];

        setGraphData({
          labels: timestamps.map(ts => new Date(ts * 1000).toLocaleDateString()),
          datasets: [{
            label: 'Stock Price',
            data: closePrices,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        });
      } else {
        setError('Invalid data structure received from the API');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Error fetching stock data. Please try again.');
    }
    setLoading(false);
  };

  const DisplayStockInfo = ({ data }) => {
    if (!data || !data.chart || !data.chart.result || !data.chart.result[0]) {
      return <Typography color="error">No stock data available</Typography>;
    }

    const stockInfo = data.chart.result[0].meta;

    return (
      <Paper className="p-4">
        <Typography variant="h6">Stock Information</Typography>
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
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <div className="flex flex-col min-h-screen">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stock Analysis
            </Typography>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Container className="flex-grow py-8">
          <SignedOut>
            <SignIn />
          </SignedOut>
          
          <SignedIn>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className="p-4">
                  <TextField 
                    fullWidth 
                    label="Enter Stock Ticker" 
                    value={ticker} 
                    onChange={(e) => setTicker(e.target.value)} 
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={fetchStockData} 
                    className="mt-2"
                    disabled={loading}
                  >
                    {loading ? 'Fetching...' : 'Fetch Stock Data'}
                  </Button>
                </Paper>
              </Grid>

              {loading && (
                <Grid item xs={12} className="text-center">
                  <CircularProgress />
                </Grid>
              )}

              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}

              {stockData && (
                <>
                  <Grid item xs={12} md={6}>
                    <DisplayStockInfo data={stockData} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper className="p-4">
                      <Typography variant="h6">Stock Graph</Typography>
                      {graphData ? (
                        <Line data={graphData} />
                      ) : (
                        <Typography color="error">No graph data available</Typography>
                      )}
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          </SignedIn>
        </Container>

        <footer className="bg-gray-200 p-4 text-center">
          <Typography>© 2024 Stock Analysis App</Typography>
        </footer>
      </div>
    </ClerkProvider>
  );
}