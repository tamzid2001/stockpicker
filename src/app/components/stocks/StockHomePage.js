import React, { useState, Suspense } from 'react';
import { Typography, Box, Tabs, Tab, Paper, Container, TextField, Button } from '@mui/material';
import ErrorBoundary from '../website/ErrorBoundary';
import LoadingFallback from '../website/LoadingFallback';
import StockAnalysis from './StockAnalysis';
import EarningsInfo from './EarningsInfo';
import StockFundamentals from './StockFundamentals';
import StockStatistics from './Statistics';
import Recommendation from './Recommendation';
import Analyst from './Analyst';
import StockOptions from './StockOptions';
// Removed the StockScreener import
import CustomML from './CustomML'; 
import Ertimur from './Ertimur';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useTicker } from '../contexts/TickerContext';
import dynamic from "next/dynamic";

const SymbolOverviewNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.SymbolOverview),
  {
    ssr: false,
  }
);
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const StockHomePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { ticker, setTicker } = useTicker(); 
  const { selectedRegion, selectedLanguage } = useGlobalContext(); 
  const [inputTicker, setInputTicker] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleInputChange = (event) => {
    setInputTicker(event.target.value);
  };

  const handleTickerSubmit = () => {
    setTicker(inputTicker);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Analysis
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2, boxShadow: 4 }}>
        <ErrorBoundary fallback={<Typography color="error">Error loading stock analysis</Typography>}>
          <Suspense fallback={<LoadingFallback />}>
            <StockAnalysis />
          </Suspense>
        </ErrorBoundary>
      </Paper>

      {ticker && (
        <Paper elevation={3} sx={{ p: 2, mt: 2, boxShadow: 4 }}>
          <AdvancedRealTimeChart theme="light" height={400} width="100%" symbol={ticker} />
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Stock Information Tabs"
          >
            {/* Removed the Stock Screener tab */}
            <Tab label="Earnings Info" />           {/* index 0 */}
            <Tab label="Stock Fundamentals" />       {/* index 1 */}
            <Tab label="Stock Statistics" />         {/* index 2 */}
            <Tab label="Recommendation" />           {/* index 3 */}
            <Tab label="Analyst Reports" />          {/* index 4 */}
            <Tab label="Stock Options" />            {/* index 5 */}
            <Tab label="Custom ML" />                {/* index 6 */}
            <Tab label="Ertimur" />                  {/* index 7 */}
          </Tabs>
          <Box sx={{ p: 3 }}>
            {tabIndex === 0 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading earnings info</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <EarningsInfo ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 1 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading stock fundamentals</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockFundamentals ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 2 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading stock statistics</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockStatistics ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 3 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading recommendation</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <Recommendation ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 4 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading analyst reports</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <Analyst ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 5 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading stock options</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <StockOptions ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 6 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading Custom ML</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <CustomML ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
            {tabIndex === 7 && (
              <ErrorBoundary fallback={<Typography color="error">Error loading Ertimur</Typography>}>
                <Suspense fallback={<LoadingFallback />}>
                  <Ertimur ticker={ticker} />
                </Suspense>
              </ErrorBoundary>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default StockHomePage;
