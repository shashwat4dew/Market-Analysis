import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SentimentDashboard from './components/SentimentDashboard';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [symbol, setSymbol] = useState('');
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchSentimentData = async (stockSymbol) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sentiment/${stockSymbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSentimentData(data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setError(`Failed to fetch sentiment data: ${err.message}`);
      console.error('Error fetching sentiment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      fetchSentimentData(symbol.trim().toUpperCase());
    }
  };

  // Auto-refresh every 30 minutes
  useEffect(() => {
    if (sentimentData && symbol) {
      const interval = setInterval(() => {
        fetchSentimentData(symbol);
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(interval);
    }
  }, [sentimentData, symbol]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Market Sentiment Dashboard
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Enter Stock Symbol (e.g., AAPL, TSLA, MSFT)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  variant="outlined"
                  placeholder="AAPL"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || !symbol.trim()}
                >
                  {loading ? <CircularProgress size={24} /> : 'Analyze Sentiment'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {lastUpdate && (
            <Typography variant="body2" color="text.secondary" align="right">
              Last updated: {lastUpdate}
            </Typography>
          )}
        </Paper>

        {sentimentData && (
          <SentimentDashboard data={sentimentData} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
