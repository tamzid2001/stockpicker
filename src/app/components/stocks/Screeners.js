// components/Screeners.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Select, MenuItem, Button, CircularProgress, Paper, Grid } from '@mui/material';

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
        fetchSymbols();
    }, [selectedScreener]);

    const fetchSymbols = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/screener?scrIds=${selectedScreener}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSymbols(data.finance.result[0].quotes || []);
        } catch (error) {
            console.error('Error fetching screener data:', error);
            setError('Error fetching screener data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleScreenerChange = (event) => {
        setSelectedScreener(event.target.value);
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Stock Screeners
                </Typography>
                <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Select
                        value={selectedScreener}
                        onChange={handleScreenerChange}
                        variant="outlined"
                        sx={{ minWidth: 200, mr: 2 }}
                    >
                        {screenerOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.replace(/_/g, ' ')}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" color="primary" onClick={fetchSymbols}>
                        Refresh
                    </Button>
                </Box>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {symbols.map((symbol, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6">{symbol.symbol}</Typography>
                                    <Typography variant="body2">Name: {symbol.shortName}</Typography>
                                    <Typography variant="body2">Exchange: {symbol.fullExchangeName}</Typography>
                                    <Typography variant="body2">Market Price: ${symbol.regularMarketPrice}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Container>
    );
};

export default Screeners;
