import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Button, Grid } from '@mui/material';
import { useGlobalContext } from '../contexts/GlobalContext';

const CustomML = () => {
    const { selectedRegion } = useGlobalContext();

    const openTradingViewScript = () => {
        window.open('https://www.tradingview.com/script/3655zoBK-Pivot-Master-Pro-SMA9-Pivot-and-Fractal-Indicator/', '_blank');
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Pivot Master Pro - SMA9 Pivot and Fractal Indicator
            </Typography>
            <Card sx={{ mb: 4, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                        Unlock the full potential of your trading strategy with Pivot Master Pro!
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                        Pivot Master Pro is a cutting-edge TradingView indicator designed to identify precise market turning points using the 9-period Simple Moving Average (SMA9) and fractal analysis. This powerful tool helps traders anticipate market reversals and trends by detecting untouched SMA9 pivots and highlighting optimal entry and exit points.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Key Features:</strong>
                    </Typography>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li>
                            <Typography variant="body2">
                                <strong>Advanced SMA9 Pivot Detection:</strong> Utilizes a sophisticated algorithm to identify untouched SMA9 pivot points, generating reliable buy and sell signals.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>Fractal-Based Take Profit Levels:</strong> Integrates fractal analysis to determine potential take profit targets and manage risk effectively.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>Clear Visual Signals:</strong> Plots the SMA9 line along with pivot levels directly on your chart, with color-coded markers for easy recognition of buy and sell entries.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>Universal Timeframe Compatibility:</strong> Optimized for all timeframes, making it suitable for scalping, day trading, and swing trading.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>User-Friendly and Customizable:</strong> Easy setup with adjustable parameters to tailor the indicator to your trading needs.
                            </Typography>
                        </li>
                    </ul>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="textSecondary" paragraph>
                        **Elevate your trading performance with Pivot Master Pro—the ultimate indicator for mastering market pivots and fractal analysis.**
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={openTradingViewScript}
                        sx={{ mt: 2 }}
                    >
                        View Indicator on TradingView
                    </Button>
                </CardContent>
            </Card>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Why Choose Pivot Master Pro?</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Enhance Decision-Making</Typography>
                                <Typography variant="body2">
                                    Gain a deeper understanding of market dynamics through SMA9 pivot analysis. Make informed trading decisions backed by technical insights.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Improve Timing and Accuracy</Typography>
                                <Typography variant="body2">
                                    Identify high-probability entry points and optimize your trade entries. Utilize fractal take profit levels to exit trades strategically.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Versatile Application</Typography>
                                <Typography variant="body2">
                                    Suitable for stocks, forex, commodities, cryptocurrencies, and more. Compatible with TradingView charts, making it accessible to a wide range of traders.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CustomML;
