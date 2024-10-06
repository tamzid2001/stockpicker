'use client'

import React, { useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Header from './components/Header';
import StockAnalysis from './components/StockAnalysis';
import EarningsInfo from './components/EarningsInfo';
import AIChat from './components/AIChat';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import NewsOutlet from './components/NewsOutlet';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [currentTicker, setCurrentTicker] = useState('');
  const [stockData, setStockData] = useState(null);

  const handleStockDataFetched = (data) => {
    setStockData(data);
    setCurrentTicker(data.chart.result[0].meta.symbol);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header colorMode={colorMode} theme={theme} />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <SignedOut>
          <Homepage />
          <NewsOutlet />
        </SignedOut>
        
        <SignedIn>
          <StockAnalysis theme={theme} onStockDataFetched={handleStockDataFetched} />
          {currentTicker && <EarningsInfo ticker={currentTicker} />}
          <NewsOutlet />
        </SignedIn>
      </Container>

      <AIChat stockData={stockData} />
      <Footer />
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