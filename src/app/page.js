'use client'

import React, { useState, Suspense, lazy, useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, CircularProgress } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const Header = lazy(() => import('./components/Header'));
const StockAnalysis = lazy(() => import('./components/StockAnalysis'));
const EarningsInfo = lazy(() => import('./components/EarningsInfo'));
const StockFundamentals = lazy(() => import('./components/StockFundamentals'));
import StockStatistics from './components/Statistics';
const AIChat = lazy(() => import('./components/AIChat'));
const Footer = lazy(() => import('./components/Footer'));
const Homepage = lazy(() => import('./components/Homepage'));
const NewsOutlet = lazy(() => import('./components/NewsOutlet'));

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function LoadingFallback() {
  return <CircularProgress />;
}

function App() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [currentTicker, setCurrentTicker] = useState('');
  const [stockData, setStockData] = useState(null);

  const handleStockDataFetched = (data) => {
    if (data && data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta) {
      setStockData(data);
      setCurrentTicker(data.chart.result[0].meta.symbol);
    } else {
      console.error('Invalid stock data structure:', data);
    }
  };

  useEffect(() => {
    console.log(`Mounted with ticker:`, currentTicker);
  }, [currentTicker]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ErrorBoundary fallback={<Typography color="error">Error loading header</Typography>}>
        <Suspense fallback={<LoadingFallback />}>
          <Header colorMode={colorMode} theme={theme} />
        </Suspense>
      </ErrorBoundary>

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <SignedOut>
          <ErrorBoundary fallback={<Typography color="error">Error loading homepage</Typography>}>
            <Suspense fallback={<LoadingFallback />}>
              <Homepage />
            </Suspense>
          </ErrorBoundary>
        </SignedOut>
        
        <SignedIn>
          <ErrorBoundary fallback={<Typography color="error">Error loading stock analysis</Typography>}>
            <Suspense fallback={<LoadingFallback />}>
              <StockAnalysis theme={theme} onStockDataFetched={handleStockDataFetched} />
            </Suspense>
          </ErrorBoundary>
          
          {currentTicker && (
            <Box>
              <Typography variant="h6" gutterBottom>Additional Information for {currentTicker}</Typography>
              <ErrorBoundary fallback={<Typography color="error">Error loading earnings info</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <EarningsInfo ticker={currentTicker} />
                </Suspense>
              </ErrorBoundary>
              
              <ErrorBoundary fallback={<Typography color="error">Error loading stock fundamentals</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockFundamentals ticker={currentTicker} />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={<Typography color="error">Error loading stock statistics</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockStatistics ticker={currentTicker} />
                </Suspense>
              </ErrorBoundary>
            </Box>
          )}
        </SignedIn>

        <ErrorBoundary fallback={<Typography color="error">Error loading news</Typography>}>
          <Suspense fallback={<LoadingFallback />}>
            <NewsOutlet />
          </Suspense>
        </ErrorBoundary>
      </Container>

      <ErrorBoundary fallback={<Typography color="error">Error loading AI chat</Typography>}>
        <Suspense fallback={<LoadingFallback />}>
          <AIChat stockData={stockData} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<Typography color="error">Error loading footer</Typography>}>
        <Suspense fallback={<LoadingFallback />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
}

function ThemedApp() {
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
    <ErrorBoundary fallback={<Typography color="error">An error occurred in the application</Typography>}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <App />
          </ClerkProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ErrorBoundary>
  );
}

export default ThemedApp;