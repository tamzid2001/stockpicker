import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Grid, Button, Container } from '@mui/material';
import { useTicker } from '../contexts/TickerContext';
import { useGlobalContext } from '../contexts/GlobalContext';

const AnalystReports = () => {
    const { ticker } = useTicker(); 
    const { selectedRegion, selectedLanguage } = useGlobalContext(); // Access region and language from global context
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            if (!ticker) {
                setError('Ticker symbol is required.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/analyst?ticker=${ticker}&region=${selectedRegion}&lang=${selectedLanguage}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.result && data.result[0] && data.result[0].hits) {
                    setReports(data.result[0].hits);
                } else {
                    throw new Error('Invalid data structure received from the API');
                }
            } catch (error) {
                console.error('Error fetching analyst reports:', error);
                setError('Error fetching analyst reports. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [ticker, selectedRegion, selectedLanguage]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!reports.length) return <Typography>No reports available for the selected ticker.</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Analyst Reports for {ticker}
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
                    Insights from leading financial analysts based on {ticker}.
                </Typography>
                <Grid container spacing={3}>
                    {reports.map((report, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ flexShrink: 0, mr: 2 }}>
                                    <img src={report.snapshot_url} alt={report.report_title} width="100" />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{report.report_title}</Typography>
                                    <Typography variant="body2">
                                        <strong>Company:</strong> {report.company_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Provider:</strong> {report.provider || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Rating:</strong> {report.investment_rating || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {report.abstract}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href={report.pdf_url}
                                        target="_blank"
                                        sx={{ mt: 2 }}
                                    >
                                        View Full Report
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default AnalystReports;
