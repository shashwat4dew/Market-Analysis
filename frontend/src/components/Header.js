import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <TrendingUpIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Market Sentiment Dashboard
        </Typography>
        <Typography variant="body2">
          Real-time Financial Sentiment Analysis
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
