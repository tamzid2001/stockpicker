import React, { useRef, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Select, MenuItem, useMediaQuery } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useGlobalContext } from '../contexts/GlobalContext';
import { useTheme } from '@mui/material/styles';
import Script from 'next/script';

const regions = ['US', 'BR', 'AU', 'CA', 'FR', 'DE', 'HK', 'IN', 'IT', 'ES', 'GB', 'SG'];
const languages = ['en-US', 'pt-BR', 'en-AU', 'en-CA', 'fr-FR', 'de-DE', 'zh-Hant-HK', 'en-IN', 'it-IT', 'es-ES', 'en-GB', 'en-SG'];

const Header = ({ colorMode, theme }) => {
  const { selectedRegion, setSelectedRegion, selectedLanguage, setSelectedLanguage } = useGlobalContext();
  const { isLoaded, isSignedIn } = useUser();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const tradingViewRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.TradingView) {
      new window.TradingView.widget({
        container_id: tradingViewRef.current.id,
        symbols: [
          { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
          { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
          { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: "adaptive",
        colorTheme: theme.palette.mode,
        locale: "en",
      });
    }
  }, [theme.palette.mode]);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  // URL for Stripe premium subscription page
  const stripeSubscriptionUrl = 'https://stripe.com/premium-subscription-url';

  return (
    <>
      {/* TradingView Widget */}
      <Box sx={{ width: '100%', backgroundColor: 'white', py: 1 }}>
        <div ref={tradingViewRef} id="tradingview-widget" style={{ overflow: 'hidden', width: '100%' }}></div>
        <Script
          id="tradingview-widget-script"
          src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
          strategy="lazyOnload"
          onLoad={() => {
            if (typeof window !== 'undefined' && window.TradingView) {
              new window.TradingView.widget({
                container_id: 'tradingview-widget',
                symbols: [
                  { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
                  { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
                  { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
                  { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
                  { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
                ],
                showSymbolLogo: true,
                isTransparent: false,
                displayMode: "adaptive",
                colorTheme: theme.palette.mode,
                locale: "en",
              });
            }
          }}
        />
      </Box>

      <AppBar position="static" color="primary" elevation={3} sx={{ width: '100%', boxShadow: 4 }}>
        <Toolbar sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Left Section: Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 0 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Stock Analysis Pro
            </Typography>
          </Box>

          {/* Right Section: Theme Switch, Region, Language, and Sign In/Sign Out */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Theme Switch */}
            <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mr: 1 }}>
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Region Select */}
            <Select
              value={selectedRegion}
              onChange={handleRegionChange}
              variant="outlined"
              sx={{ mr: 1, minWidth: 80, color: 'white', borderColor: 'white' }}
            >
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>

            {/* Language Select */}
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              variant="outlined"
              sx={{ mr: 1, minWidth: 100, color: 'white', borderColor: 'white' }}
            >
              {languages.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>

            {/* Premium Subscription Button */}
            <SignedIn>
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: '20px', ml: 1, mb: isMobile ? 1 : 0 }}
                onClick={() => window.location.href = stripeSubscriptionUrl}
              >
                Get Premium
              </Button>
            </SignedIn>
            <SignedOut>
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: '20px', ml: 1, mb: isMobile ? 1 : 0 }}
                onClick={() => window.location.href = '/sign-in'}
              >
                Get Premium
              </Button>
            </SignedOut>

            {/* Sign In/Sign Out */}
            <SignedOut>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: '20px', ml: 1, mb: isMobile ? 1 : 0 }}
              >
                <SignInButton />
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
