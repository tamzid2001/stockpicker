import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Select, MenuItem, Button, CircularProgress, Paper, Grid } from '@mui/material';
import dynamic from "next/dynamic";
const SymbolOverviewNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.SymbolOverview),
  {
    ssr: false,
  }
);
import { MarketData } from "react-ts-tradingview-widgets";

const screenerOptions = [
    'MOST_ACTIVES',
    'DAY_GAINERS',
    'DAY_LOSERS',
    'AUTO_MANUFACTURERS',
    'MS_CONSUMER_CYCLICAL',
    'MOST_WATCHED_TICKERS',
    'all_cryptocurrencies_us'
];

const Screeners = () => {
    const [selectedScreener, setSelectedScreener] = useState('MOST_ACTIVES');
    const [symbols, setSymbols] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // AbortController to clean up ongoing fetch requests on component unmount or change
        const controller = new AbortController();
        const fetchSymbols = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/screener?scrIds=${selectedScreener}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data?.finance?.result?.[0]?.quotes) {
                    setSymbols(data.finance.result[0].quotes);
                } else {
                    throw new Error('Invalid data structure received from the API');
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching screener data:', error);
                    setError('Error fetching screener data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        //fetchSymbols();

        // Clean up function for the effect
        return () => {
            controller.abort();
        };
    }, [selectedScreener]);

    const handleScreenerChange = (event) => {
        setSelectedScreener(event.target.value);
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Stock Screeners
                </Typography>
                <MarketData colorTheme="light" width="100%" height={400}></MarketData>
            </Paper>
        </Container>
    );
};

export default Screeners;
