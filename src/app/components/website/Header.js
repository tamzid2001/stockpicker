// components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const Header = ({ colorMode, theme }) => (
  <AppBar position="static" color="primary" elevation={3}>
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Left Section: Logo and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ mr: 2, fontWeight: 'bold' }}>
          Stock Analysis Pro
        </Typography>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      {/* Right Section: Sign In/Sign Out */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

export default Header;
