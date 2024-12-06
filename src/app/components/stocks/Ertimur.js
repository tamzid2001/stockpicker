import React, { useState } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useTicker } from '../contexts/TickerContext';
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material';

const Ertimur = () => {
    const { ticker } = useTicker();
    const { selectedRegion, selectedLanguage } = useGlobalContext();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchEarningsData = async () => {
        try {
            const res = await fetch(`/api/ertimur(2003)?symbol=${ticker}&region=${selectedRegion}&lang=${selectedLanguage}`);
            const responseData = await res.json();
            if (responseData.error) {
                setError(responseData.error);
            } else {
                setData(responseData);
            }
        } catch (err) {
            setError('An error occurred while fetching data.');
        }
    };

    const renderRecommendations = () => {
        if (!data || !data.recommendations) return null;
        return data.recommendations.map((rec, index) => (
            <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h6" color={rec.signal === 'Buy' ? 'green' : rec.signal === 'Sell' ? 'red' : 'orange'}>
                        {rec.signal} Signal
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1">Date: {rec.date}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {rec.reason}
                    </Typography>
                </CardContent>
            </Card>
        ));
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Earnings Analysis - Ertimur (beta)
            </Typography>
            <Button variant="contained" color="primary" onClick={fetchEarningsData}>
                Fetch Earnings Data
            </Button>
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            {data && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Earnings Surprises:</Typography>
                    {data.earningsSurprises.map((item, index) => (
                        <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="body1">Date: {item.date}</Typography>
                                <Typography variant="body2">
                                    Actual: {item.actual}, Estimate: {item.estimate}, Surprise: {item.surprise}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Typography variant="h6" sx={{ mt: 4 }}>Recommendations:</Typography>
                    {renderRecommendations()}
                </Box>
            )}
        </Box>
    );
};

export default Ertimur;
