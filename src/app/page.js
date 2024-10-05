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
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [userQuery, setUserQuery] = useState('');

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/stock?symbol=${ticker}`);
      const data = await response.json();
      setStockData(data);
      
      // Prepare graph data
      const prices = data.prices.slice(0, 30).reverse();
      setGraphData({
        labels: prices.map(price => new Date(price.date * 1000).toLocaleDateString()),
        datasets: [{
          label: 'Stock Price',
          data: prices.map(price => price.close),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });

      // Fetch news
      const newsResponse = await fetch(`/api/news?symbol=${ticker}`);
      const newsData = await newsResponse.json();
      setNews(newsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
    setLoading(false);
  };

  const handleAiQuery = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery, stockData })
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error('Error querying AI:', error);
    }
    setLoading(false);
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
                  >
                    Fetch Stock Data
                  </Button>
                </Paper>
              </Grid>

              {loading && (
                <Grid item xs={12} className="text-center">
                  <CircularProgress />
                </Grid>
              )}

              {stockData && (
                <>
                  <Grid item xs={12} md={6}>
                    <Paper className="p-4">
                      <Typography variant="h6">Stock Information</Typography>
                      <Typography>Symbol: {stockData.symbol}</Typography>
                      <Typography>Price: ${stockData.price.regularMarketPrice.raw}</Typography>
                      <Typography>Change: {stockData.price.regularMarketChange.fmt}</Typography>
                      <Typography>Market Cap: {stockData.price.marketCap.fmt}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper className="p-4">
                      <Typography variant="h6">Stock Graph</Typography>
                      {graphData && <Line data={graphData} />}
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper className="p-4">
                      <Typography variant="h6">Latest News</Typography>
                      <List>
                        {news.map((item, index) => (
                          <ListItem key={index}>
                            <ListItemText 
                              primary={item.title} 
                              secondary={new Date(item.providerPublishTime * 1000).toLocaleString()} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper className="p-4">
                      <Typography variant="h6">AI Assistant</Typography>
                      <TextField 
                        fullWidth 
                        label="Ask about the stock data" 
                        value={userQuery} 
                        onChange={(e) => setUserQuery(e.target.value)} 
                      />
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleAiQuery} 
                        className="mt-2"
                      >
                        Ask AI
                      </Button>
                      {aiResponse && (
                        <Typography className="mt-2">{aiResponse}</Typography>
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