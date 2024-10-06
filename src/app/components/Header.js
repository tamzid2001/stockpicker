// components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { UserButton, SignedIn } from "@clerk/nextjs";

const Header = ({ colorMode, theme }) => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Stock Analysis Pro
      </Typography>
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </Toolbar>
  </AppBar>
);

export default Header;