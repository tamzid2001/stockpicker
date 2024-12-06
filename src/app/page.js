'use client';

import React, { Suspense, useContext, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, CircularProgress } from '@mui/material';
import ErrorBoundary from './components/website/ErrorBoundary';
import { TickerProvider, useTicker } from './components/contexts/TickerContext';
import { GlobalProvider } from './components/contexts/GlobalContext';

import Header from './components/website/Header';
import Footer from './components/website/Footer';
import AIChat from './components/website/AIChat';
import StockHomePage from './components/stocks/StockHomePage'; // For signed-in users
import Homepage from './components/website/Homepage'; // For signed-out users
import NewsOutlet from './components/website/NewsOutlet';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function LoadingFallback() {
  return <CircularProgress />;
}

function App() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { ticker, setTicker } = useTicker();
  const [stockData, setStockData] = useState(null);

  const handleStockDataFetched = (data) => {
    if (data && data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta) {
      setStockData(data);
      setTicker(data.chart.result[0].meta.symbol);
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
          <ErrorBoundary fallback={<Typography color="error">Error loading stock home page</Typography>}>
            <Suspense fallback={<LoadingFallback />}>
              <StockHomePage onStockDataFetched={handleStockDataFetched} />
            </Suspense>
          </ErrorBoundary>
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
            <GlobalProvider>
              <TickerProvider>
                <App />
              </TickerProvider>
            </GlobalProvider>
          </ClerkProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ErrorBoundary>
  );
}

export default ThemedApp;
