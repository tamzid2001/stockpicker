// components/RecentUpdates.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress, Box, Grid } from '@mui/material';
import { useTicker } from '../contexts/TickerContext';
import { useGlobalContext } from '../contexts/GlobalContext';

const RecentUpdates = () => {
    const { ticker } = useTicker();
    const { selectedRegion, selectedLanguage } = useGlobalContext();
    const [updateData, setUpdateData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpdateData = async () => {
            if (!ticker) {
                setError('Ticker symbol is required.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/recentupdates?ticker=${ticker}&region=${selectedRegion}&lang=${selectedLanguage}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUpdateData(data.quoteSummary?.result?.[0] || {});
            } catch (error) {
                console.error('Error fetching recent updates:', error);
                setError('Error fetching recent updates data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUpdateData();
    }, [ticker, selectedRegion, selectedLanguage]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!updateData) return <Typography>No recent updates available for the selected ticker.</Typography>;

    const { corporateActions, secFilings, calendarEvents, upgradeDowngradeHistory } = updateData;

    return (
        <Box sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Recent Updates for {ticker}
                </Typography>

                <Typography variant="h6" gutterBottom>Corporate Actions</Typography>
                {corporateActions?.corporateActions?.length ? (
                    corporateActions.corporateActions.map((action, index) => (
                        <Typography key={index} variant="body2">
                            {action.description}
                        </Typography>
                    ))
                ) : (
                    <Typography>No corporate actions available.</Typography>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>SEC Filings</Typography>
                {secFilings?.filings?.length ? (
                    secFilings.filings.map((filing, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>{filing.type}</strong> - {filing.title} ({new Date(filing.epochDate * 1000).toLocaleDateString()})
                            </Typography>
                            <a href={filing.edgarUrl} target="_blank" rel="noopener noreferrer">
                                View Filing
                            </a>
                        </Box>
                    ))
                ) : (
                    <Typography>No SEC filings available.</Typography>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Event Calendar</Typography>
                {calendarEvents?.earnings?.earningsDate?.length ? (
                    calendarEvents.earnings.earningsDate.map((event, index) => (
                        <Typography key={index} variant="body2">
                            Earnings Date: {new Date(event.raw * 1000).toLocaleDateString()}
                        </Typography>
                    ))
                ) : (
                    <Typography>No upcoming events available.</Typography>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Upgrade/Downgrade History</Typography>
                {upgradeDowngradeHistory?.history?.length ? (
                    upgradeDowngradeHistory.history.map((upgrade, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                {upgrade.firm} upgraded to {upgrade.toGrade} from {upgrade.fromGrade} on {new Date(upgrade.epochGradeDate * 1000).toLocaleDateString()}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography>No upgrade/downgrade history available.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default RecentUpdates;
