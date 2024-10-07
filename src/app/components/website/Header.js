import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Select, MenuItem } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useGlobalContext } from '../contexts/GlobalContext';

const regions = ['US', 'BR', 'AU', 'CA', 'FR', 'DE', 'HK', 'IN', 'IT', 'ES', 'GB', 'SG'];
const languages = ['en-US', 'pt-BR', 'en-AU', 'en-CA', 'fr-FR', 'de-DE', 'zh-Hant-HK', 'en-IN', 'it-IT', 'es-ES', 'en-GB', 'en-SG'];

const Header = ({ colorMode, theme }) => {
  const { selectedRegion, setSelectedRegion, selectedLanguage, setSelectedLanguage } = useGlobalContext();

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Section: Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ mr: 2, fontWeight: 'bold' }}>
            Stock Analysis Pro
          </Typography>
        </Box>

        {/* Right Section: Theme Switch, Region, Language, and Sign In/Sign Out */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Theme Switch */}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mr: 2 }}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Region Select */}
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            variant="outlined"
            sx={{ mr: 2, minWidth: 100, color: 'white', borderColor: 'white' }}
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
            sx={{ mr: 2, minWidth: 120, color: 'white', borderColor: 'white' }}
          >
            {languages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>

          {/* Sign In/Sign Out */}
          <SignedOut>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: '20px', ml: 2 }}
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
  );
};

export default Header;
