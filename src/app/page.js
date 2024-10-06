'use client'

import React, { useState, useEffect } from 'react';
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, TextField, Button, Grid, Paper, List, ListItem, ListItemText, IconButton, Box, Switch, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { Brightness4, Brightness7, Chat } from '@mui/icons-material';
import { motion } from 'framer-motion';
import NewsOutlet from '../components/NewsOutlet';  // Import the NewsOutlet component
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const suggestedTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NVDA', 'JPM', 'V', 'JNJ'];

function App() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stockResponse, earningsResponse] = await Promise.all([
        fetch(`/api/stock?symbol=${ticker}`),
        fetch(`/api/earnings?symbol=${ticker}`)
      ]);
      const stockData = await stockResponse.json();
      const earningsData = await earningsResponse.json();
      
      setStockData(stockData);
      setEarningsData(earningsData);
      
      if (stockData.chart && stockData.chart.result && stockData.chart.result[0]) {
        const result = stockData.chart.result[0];
        const timestamps = result.timestamp || [];
        const closePrices = result.indicators.quote[0].close || [];

        // Limit the number of data points to prevent performance issues
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
      setError('Error fetching data. Please try again.');
    }
    setLoading(false);
  };

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;
  
    const newUserMessage = { role: 'user', content: userMessage, stockData: stockData };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
  
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...chatMessages, newUserMessage]),
      });
  
      if (!response.body) throw new Error('No response body');
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiResponse += decoder.decode(value);
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: aiResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
  };

  const DisplayStockInfo = ({ data }) => {
    if (!data || !data.chart || !data.chart.result || !data.chart.result[0]) {
      return <Typography color="error">No stock data available</Typography>;
    }

    const stockInfo = data.chart.result[0].meta;

    return (
      <Paper elevation={3} className="p-4">
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

  const DisplayEarningsInfo = ({ data }) => {
    if (!data || !data.quoteSummary || !data.quoteSummary.result || !data.quoteSummary.result[0] || !data.quoteSummary.result[0].earnings) {
      return <Typography color="error">No earnings data available</Typography>;
    }

    const earningsInfo = data.quoteSummary.result[0].earnings;

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Analysis Pro
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <SignedOut>
          {showIntro ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 600, margin: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                  Welcome to Stock Analysis Pro
                </Typography>
                <Typography variant="body1" paragraph>
                  Get real-time stock data, earnings information, and AI-powered insights to make informed investment decisions.
                </Typography>
                <SignIn />
              </Paper>
            </motion.div>
          ) : (
            <SignIn />
          )}
          <NewsOutlet />
        </SignedOut>
        
        <SignedIn>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <TextField 
                  fullWidth 
                  label="Enter Stock Ticker" 
                  value={ticker} 
                  onChange={(e) => setTicker(e.target.value)} 
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={fetchData} 
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Fetching...' : 'Analyze Stock'}
                </Button>
              </Paper>
            </Grid>

            {loading && (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <IconButton color="primary" size="large">
                    <Brightness7 />
                  </IconButton>
                </motion.div>
              </Grid>
            )}

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
                                ticks: {
                                  maxTicksLimit: 10
                                }
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

            {earningsData && (
              <Grid item xs={12}>
                <DisplayEarningsInfo data={earningsData} />
              </Grid>
            )}
          </Grid>
          <NewsOutlet />
        </SignedIn>
      </Container>

      <Fab 
        color="secondary" 
        aria-label="chat"
        onClick={() => setChatOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Chat />
      </Fab>

      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>AI Assistant</DialogTitle>
        <DialogContent>
          <List>
            {chatMessages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={message.role === 'user' ? 'You' : 'AI'}
                  secondary={message.content}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about stocks..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>Close</Button>
          <Button onClick={handleChatSubmit} color="primary">Send</Button>
        </DialogActions>
      </Dialog>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Stock Analysis Pro. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default function ThemedApp() {
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#dc004e' : '#f48fb1',
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}