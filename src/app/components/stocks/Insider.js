import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import ErrorBoundary from '../website/ErrorBoundary';
import { useTicker } from '../contexts/TickerContext';
import { useGlobalContext } from '../contexts/GlobalContext';

const InsiderTransactions = () => {
  const { ticker } = useTicker();
  const { selectedRegion } = useGlobalContext();
  const [insiderData, setInsiderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchInsiderData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/insiders?symbol=${ticker}&region=${selectedRegion}`);
        if (!response.ok) {
          throw new Error('Error fetching data');
        }

        const data = await response.json();
        setInsiderData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsiderData();
  }, [ticker, selectedRegion]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!insiderData || !insiderData.insiderTransactions) {
    return <Typography>No insider transactions data available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Insider Transactions for {ticker}</Typography>
      {insiderData.insiderTransactions.transactions.map((transaction, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="body1"><strong>Filer Name:</strong> {transaction.filerName}</Typography>
          <Typography variant="body2"><strong>Relation:</strong> {transaction.filerRelation}</Typography>
          <Typography variant="body2"><strong>Transaction:</strong> {transaction.transactionText || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Shares:</strong> {transaction.shares.fmt}</Typography>
          <Typography variant="body2"><strong>Value:</strong> {transaction.value?.fmt || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Date:</strong> {transaction.startDate.fmt}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default () => (
  <ErrorBoundary fallback={<Typography color="error">Error loading insider transactions</Typography>}>
    <InsiderTransactions />
  </ErrorBoundary>
);
