// components/RecentUpdates.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress, Box, Grid } from '@mui/material';
import { useTicker } from '../contexts/TickerContext';
import { useGlobalContext } from '../contexts/GlobalContext';
import dynamic from "next/dynamic";
const SymbolOverviewNoSSR = dynamic(
    () => import("react-ts-tradingview-widgets").then((w) => w.SymbolOverview),
    {
      ssr: false,
    }
  );
import { Timeline } from "react-ts-tradingview-widgets";

<Timeline colorTheme="dark" feedMode="market" market="crypto" height={400} width="100%"></Timeline>

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

        //fetchUpdateData();
    }, [ticker, selectedRegion, selectedLanguage]);

    // if (loading) return <CircularProgress />;
    // if (error) return <Typography color="error">{error}</Typography>;
    // if (!updateData) return <Typography>No recent updates available for the selected ticker.</Typography>;

    const { corporateActions, secFilings, calendarEvents, upgradeDowngradeHistory } = updateData;

    return (
        <Box sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Recent Updates for {ticker}
                </Typography>

                <Timeline colorTheme="light" feedMode="symbol" symbol={ticker} height={400} width="100%"></Timeline>
            </Paper>
        </Box>
    );
};

export default RecentUpdates;
