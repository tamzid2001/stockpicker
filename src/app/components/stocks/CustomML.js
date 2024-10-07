import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';

const InsiderPivot = () => {
    const [symbol, setSymbol] = useState('');
    const [interval, setInterval] = useState('1mo');
    const [range, setRange] = useState('5y');
    const [region, setRegion] = useState('US');
    const [response, setResponse] = useState(null);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/ml?symbol=${symbol}&interval=${interval}&region=${region}&range=${range}`);
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Insider Pivot Points
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    variant="outlined"
                />
                <Select value={interval} onChange={(e) => setInterval(e.target.value)}>
                    {['1m', '2m', '5m', '15m', '30m', '60m', '1d', '1wk', '1mo'].map((int) => (
                        <MenuItem key={int} value={int}>{int}</MenuItem>
                    ))}
                </Select>
                <Select value={range} onChange={(e) => setRange(e.target.value)}>
                    {['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'].map((rng) => (
                        <MenuItem key={rng} value={rng}>{rng}</MenuItem>
                    ))}
                </Select>
                <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                    {['US', 'BR', 'AU', 'CA', 'FR', 'DE', 'HK', 'IN', 'IT', 'ES', 'GB', 'SG'].map((reg) => (
                        <MenuItem key={reg} value={reg}>{reg}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Button variant="contained" color="primary" onClick={fetchData}>
                Fetch Data
            </Button>

            {response && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Results:</Typography>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </Box>
            )}
        </Box>
    );
};

export default InsiderPivot;
