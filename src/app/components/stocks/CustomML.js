import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Button, Grid } from '@mui/material';
import { useGlobalContext } from '../contexts/GlobalContext';

const CustomML = () => {
    const { selectedRegion } = useGlobalContext();

    const openTradingViewIndicator = () => {
        window.open('https://www.tradingview.com/script/3655zoBK-Pivot-Master-Pro-SMA9-Pivot-and-Fractal-Indicator/', '_blank');
    };

    const openTradingViewStrategy = () => {
        window.open('https://www.tradingview.com/script/3HxbFgjV-Pivot-Master-Pro-Strategy-with-Martingale/', '_blank');
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Pivot Master Pro - Trading Tools for Enhanced Performance
            </Typography>
            <Card sx={{ mb: 4, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                        Unlock the full potential of your trading strategy with Pivot Master Pro!
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                        Pivot Master Pro offers a range of advanced tools, including the SMA9 Pivot and Fractal Indicator, and the Martingale Strategy designed to optimize your trading outcomes. Whether you're a scalper or a day trader, these tools help anticipate market reversals and trends by detecting untouched SMA9 pivots and offering intelligent position management strategies.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={openTradingViewIndicator}
                        sx={{ mt: 2 }}
                    >
                        View Indicator on TradingView
                    </Button>
                </CardContent>
            </Card>
            <Card sx={{ mb: 4, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                        Pivot Master Pro Strategy with Martingale
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                        Elevate your short-term trading with the Pivot Master Pro Martingale Strategy, specifically designed for 1-minute and 5-minute charts. This algorithmic trading system integrates the precision of SMA9 pivot points with an intelligent martingale approach to maximize profitability in fast-paced markets.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Key Features:</strong>
                    </Typography>
                    <ul style={{ marginLeft: '1.5rem' }}>
                        <li>
                            <Typography variant="body2">
                                <strong>Optimized for Short Timeframes:</strong> Fine-tuned for 1-minute and 5-minute charts to capture rapid market movements, ideal for day traders and scalpers.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>Fractal-Based Take Profit Levels:</strong> Uses fractal detection to set accurate take profit targets and leverage market patterns effectively.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>Intelligent Martingale System:</strong> Adds positions at strategic price intervals during drawdowns, aiming for the original take profit without stop losses.
                            </Typography>
                        </li>
                    </ul>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={openTradingViewStrategy}
                        sx={{ mt: 2 }}
                    >
                        View Strategy on TradingView
                    </Button>
                </CardContent>
            </Card>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Why Choose Pivot Master Pro?</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Capitalize on Intraday Opportunities</Typography>
                                <Typography variant="body2">
                                    Designed to exploit short-term price movements, enabling you to react quickly to market conditions and maximize profit potential within the trading day.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Strategic Position Management</Typography>
                                <Typography variant="body2">
                                    Employs a disciplined, rule-based approach to eliminate emotional decision-making and strategically manage positions during unfavorable price movements.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Versatile Application</Typography>
                                <Typography variant="body2">
                                    Suitable for trading forex, indices, commodities, and cryptocurrencies on lower timeframes. Adjusts seamlessly to different market conditions.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 4 }}>
                *Disclaimer: Trading financial instruments involves risk. The Pivot Master Pro tools are designed for educational and informational purposes and should not be considered financial advice.*
            </Typography>
        </Box>
    );
};

export default CustomML;
