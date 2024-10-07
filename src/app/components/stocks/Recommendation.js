// components/RecommendationTrend.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress, Box, Grid } from '@mui/material';
import { useTicker } from '../contexts/TickerContext';
import { useGlobalContext } from '../contexts/GlobalContext';

const RecommendationTrend = () => {
    const { ticker } = useTicker();
    const { selectedRegion, selectedLanguage } = useGlobalContext();
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendData = async () => {
            if (!ticker) {
                setError('Ticker symbol is required.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/recommendation?ticker=${ticker}&region=${selectedRegion}&lang=${selectedLanguage}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.quoteSummary && data.quoteSummary.result && data.quoteSummary.result[0]) {
                    setTrendData(data.quoteSummary.result[0].recommendationTrend.trend);
                } else {
                    throw new Error('Invalid data structure received from the API');
                }
            } catch (error) {
                console.error('Error fetching recommendation trend:', error);
                setError('Error fetching recommendation trend data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrendData();
    }, [ticker, selectedRegion, selectedLanguage]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!trendData.length) return <Typography>No recommendation trends available for the selected ticker.</Typography>;

    return (
        <Box sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Recommendation Trends for {ticker}
                </Typography>
                <Grid container spacing={2}>
                    {trendData.map((trend, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="body1"><strong>Period:</strong> {trend.period}</Typography>
                                <Typography variant="body2">Strong Buy: {trend.strongBuy}</Typography>
                                <Typography variant="body2">Buy: {trend.buy}</Typography>
                                <Typography variant="body2">Hold: {trend.hold}</Typography>
                                <Typography variant="body2">Sell: {trend.sell}</Typography>
                                <Typography variant="body2">Strong Sell: {trend.strongSell}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default RecommendationTrend;
