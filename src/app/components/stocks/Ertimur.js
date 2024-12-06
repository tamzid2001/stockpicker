import React, { useState } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useTicker } from '../contexts/TickerContext';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Divider, 
  Link 
} from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

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
                    <Typography 
                      variant="h6" 
                      color={
                        rec.signal === 'Buy' 
                          ? 'green' 
                          : rec.signal === 'Sell' 
                            ? 'red' 
                            : 'orange'
                      }
                    >
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
            {/* Introductory Card about the Ertimur Study */}
            <Card sx={{ mb: 4, p: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Understanding Market Reactions to Revenue vs. Expense Surprises
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This analysis is inspired by the insights from Ertimur (2003), 
                        “Differential Market Reactions to Revenue and Expense Surprises.”
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Key Insights from the Study:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                        • Investors value a dollar surprise in revenue more highly than a dollar surprise due to expense reductions.<br/>
                        • Breaking earnings surprises down into revenue and expense components provides more information than aggregate earnings surprises alone.<br/>
                        • Growth firms benefit more from positive revenue surprises, while value firms’ performance may be more resilient to expense-driven gains.<br/>
                        • Market reactions vary based on contribution margin ratio, persistence of expenses versus sales, and the composition of operating expenses.<br/>
                        • Meeting or beating analysts’ forecasts by managing expenses rather than boosting revenue may trigger suspicion and weaker positive reactions, especially for growth firms.
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        In essence, the nature and source of an earnings surprise matters. Understanding whether it stems from top-line growth (revenue) or cost management (expenses) can shape market perceptions and investment decisions.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      endIcon={<OpenInNew />} 
                      component={Link} 
                      href="https://www.northinfo.com/documents/145.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                        View Full Study (PDF)
                    </Button>
                </CardActions>
            </Card>

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
                    <Typography variant="h6" gutterBottom>Earnings Surprises:</Typography>
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
