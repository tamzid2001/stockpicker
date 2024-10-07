// components/StockPageHome.js

import React, { Suspense } from 'react';
import { Box, Typography } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';
import StockScreener from './stocks/Screeners';
import StockAnalysis from './stocks/StockAnalysis';
import EarningsInfo from './stocks/EarningsInfo';
import StockFundamentals from './stocks/StockFundamentals';
import StockStatistics from './stocks/Statistics';
import AnalystReports from './stocks/AnalystReports';
import StockOptions from './stocks/StockOptions';
import { useTicker } from '../contexts/TickerContext';

function LoadingFallback() {
  return <Typography>Loading...</Typography>;
}

const StockPageHome = ({ theme, handleStockDataFetched }) => {
  const { ticker } = useTicker(); // Access the global ticker from context

  return (
    <>
      <ErrorBoundary fallback={<Typography color="error">Error loading stock screener</Typography>}>
        <Suspense fallback={<LoadingFallback />}>
          <StockScreener />
        </Suspense>
      </ErrorBoundary>

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

          <ErrorBoundary fallback={<Typography color="error">Error loading analyst reports</Typography>}>
            <Suspense fallback={<LoadingFallback />}>
              <AnalystReports ticker={ticker} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<Typography color="error">Error loading stock options</Typography>}>
            <Suspense fallback={<LoadingFallback />}>
              <StockOptions ticker={ticker} />
            </Suspense>
          </ErrorBoundary>
        </Box>
      )}
    </>
  );
};

export default StockPageHome;
