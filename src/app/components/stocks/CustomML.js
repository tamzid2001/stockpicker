import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, Card, CardContent, Divider, Grid } from '@mui/material';
import { useGlobalContext } from '../contexts/GlobalContext';

const CustomML = () => {
    const [symbol, setSymbol] = useState('');
    const [interval, setInterval] = useState('1mo');
    const [range, setRange] = useState('5y');
    const [response, setResponse] = useState(null);
    const { selectedRegion } = useGlobalContext(); // Access region from global context

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/ml?symbol=${symbol}&interval=${interval}&region=${selectedRegion}&range=${range}`);
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderResults = () => {
        if (!response || !response.untouchedPivots || response.untouchedPivots.length === 0) {
            return <Typography>No untouched pivots found.</Typography>;
        }

        return response.untouchedPivots.map((pivot, index) => (
            <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h6" color="primary">
                        {pivot.signal} Signal
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1">
                        Timestamp: {new Date(pivot.timestamp * 1000).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {pivot.signal === 'Buy' ? 'Pending Buy Opportunity' : 'Pending Sell Opportunity'}
                    </Typography>
                </CardContent>
            </Card>
        ));
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Custom ML Pivots
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    variant="outlined"
                    sx={{ flex: 1 }}
                />
                <Select value={interval} onChange={(e) => setInterval(e.target.value)} sx={{ minWidth: 120 }}>
                    {['1m', '2m', '5m', '15m', '30m', '60m', '1d', '1wk', '1mo'].map((int) => (
                        <MenuItem key={int} value={int}>{int}</MenuItem>
                    ))}
                </Select>
                <Select value={range} onChange={(e) => setRange(e.target.value)} sx={{ minWidth: 120 }}>
                    {['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'].map((rng) => (
                        <MenuItem key={rng} value={rng}>{rng}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Button variant="contained" color="primary" onClick={fetchData}>
                Fetch Data
            </Button>

            {response && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Untouched Pivots
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {renderResults()}
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default CustomML;
