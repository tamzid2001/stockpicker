'use client';

import React, { Suspense, lazy, useContext, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, CircularProgress } from '@mui/material';
import ErrorBoundary from './components/website/ErrorBoundary';
import { TickerProvider, useTicker } from './components/stocks/TickerContext'; // Import the TickerProvider and useTicker

// Lazy load components
const Header = lazy(() => import('./components/website/Header'));
const StockAnalysis = lazy(() => import('./components/stocks/StockAnalysis'));
const EarningsInfo = lazy(() => import('./components/stocks/EarningsInfo'));
const StockFundamentals = lazy(() => import('./components/stocks/StockFundamentals'));
import StockStatistics from './components/stocks/Statistics';
const AIChat = lazy(() => import('./components/website/AIChat'));
const Footer = lazy(() => import('./components/website/Footer'));
const Homepage = lazy(() => import('./components/website/Homepage'));
const NewsOutlet = lazy(() => import('./components/website/NewsOutlet'));
const About = lazy(() => import('./components/website/About'));
const Contact = lazy(() => import('./components/website/Contact'));
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function LoadingFallback() {
  return <CircularProgress />;
}

function App() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { ticker, setTicker } = useTicker(); // Access the global ticker using the useTicker hook
  const [stockData, setStockData] = useState(null);

  const handleStockDataFetched = (data) => {
    if (data && data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta) {
      setStockData(data);
      setTicker(data.chart.result[0].meta.symbol); // Update the global ticker
    } else {
      console.error('Invalid stock data structure:', data);
    }
  };

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
          
          {ticker && (
            <Box>
              <Typography variant="h6" gutterBottom>Additional Information for {ticker}</Typography>
              <ErrorBoundary fallback={<Typography color="error">Error loading earnings info</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <EarningsInfo ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
              
              <ErrorBoundary fallback={<Typography color="error">Error loading stock fundamentals</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockFundamentals ticker={ticker} />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={<Typography color="error">Error loading stock statistics</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockStatistics ticker={ticker} />
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
  const [mode, setMode] = useState('light');
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
            <TickerProvider> {/* Wrap the entire app in the TickerProvider */}
              <App />
            </TickerProvider>
          </ClerkProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ErrorBoundary>
  );
}

export default ThemedApp;
