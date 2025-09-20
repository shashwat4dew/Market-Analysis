import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Header = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <TrendingUpIcon sx={{ mr: 2, fontSize: 28 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Market Sentiment Dashboard
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          AI-Powered Financial Analysis
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
