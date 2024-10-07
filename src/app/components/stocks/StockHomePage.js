import React, { useState, Suspense } from 'react';
import { Typography, Box, Tabs, Tab, Paper, Container } from '@mui/material';
import ErrorBoundary from '../website/ErrorBoundary';
import LoadingFallback from '../website/LoadingFallback';
import StockAnalysis from './StockAnalysis';
import EarningsInfo from './EarningsInfo';
import StockFundamentals from './StockFundamentals';
import StockStatistics from './Statistics';
import Recommendation from './Recommendation';
import RecentUpdates from './RecentUpdates';
import Analyst from './Analyst';
import StockOptions from './StockOptions';
import StockScreener from './Screeners';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useTicker } from '../contexts/TickerContext';

const StockHomePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { ticker } = useTicker(); // Accessing ticker from TickerContext
  const { selectedRegion, selectedLanguage } = useGlobalContext(); // Accessing region and language from GlobalContext

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Information for {ticker || 'Select a Stock'}
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        Region: {selectedRegion} | Language: {selectedLanguage}
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2, boxShadow: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Stock Information Tabs"
        >
          <Tab label="Stock Screener" />
          <Tab label="Stock Analysis" />
          <Tab label="Earnings Info" />
          <Tab label="Stock Fundamentals" />
          <Tab label="Stock Statistics" />
          <Tab label="Recommendation" />
          <Tab label="Recent Updates" />
          <Tab label="Analyst Reports" />
          <Tab label="Stock Options" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {tabIndex === 0 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading stock screener</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <StockScreener />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 1 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading stock analysis</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <StockAnalysis />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 2 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading earnings info</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <EarningsInfo ticker={ticker} />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 3 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading stock fundamentals</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <StockFundamentals ticker={ticker} />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 4 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading stock statistics</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <StockStatistics ticker={ticker} />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 5 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading recommendation</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <Recommendation ticker={ticker} />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 6 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading recent updates</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <RecentUpdates ticker={ticker} />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 7 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading analyst reports</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <Analyst ticker={ticker} />
              </Suspense>
            </ErrorBoundary>
          )}
          {tabIndex === 8 && (
            <ErrorBoundary fallback={<Typography color="error">Error loading stock options</Typography>}>
              <Suspense fallback={<LoadingFallback />}>
                <StockOptions ticker={ticker} />
              </Suspense>
            </ErrorBoundary>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default StockHomePage;
