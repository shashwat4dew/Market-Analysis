import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress
} from '@mui/material';
import SentimentWordCloud from './SentimentWordCloud';

const SentimentDashboard = ({ data }) => {
  const { symbol, overallSentiment, news, newsCount } = data;

  const getSentimentColor = (rating) => {
    switch (rating) {
      case 5: return '#4caf50'; // green
      case 4: return '#8bc34a'; // light green
      case 3: return '#ff9800'; // orange
      case 2: return '#f44336'; // red
      case 1: return '#d32f2f'; // dark red
      default: return '#9e9e9e'; // grey
    }
  };

  const getSentimentLabel = (rating) => {
    switch (rating) {
      case 5: return 'Very Positive';
      case 4: return 'Positive';
      case 3: return 'Neutral';
      case 2: return 'Negative';
      case 1: return 'Very Negative';
      default: return 'Unknown';
    }
  };

  const getSentimentIcon = (rating) => {
    switch (rating) {
      case 5: return '😄';
      case 4: return '🙂';
      case 3: return '😐';
      case 2: return '😟';
      case 1: return '😞';
      default: return '❓';
    }
  };

  return (
    <Box>
      {/* Overall Sentiment Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {symbol} Sentiment
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" component="span" sx={{ mr: 2 }}>
                  {getSentimentIcon(overallSentiment.rating)}
                </Typography>
                <Box>
                  <Typography variant="h4" sx={{ color: getSentimentColor(overallSentiment.rating) }}>
                    {overallSentiment.rating}/5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getSentimentLabel(overallSentiment.rating)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Based on {newsCount} news articles
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(overallSentiment.rating / 5) * 100}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getSentimentColor(overallSentiment.rating),
                    borderRadius: 4,
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sentiment Word Cloud
              </Typography>
              <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa', borderRadius: 1 }}>
                <SentimentWordCloud news={news} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* News List */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent News ({newsCount} articles)
        </Typography>
        <List>
          {news.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>
                        {item.headline}
                      </Typography>
                      <Chip
                        label={`${item.sentiment.rating}/5 ${getSentimentLabel(item.sentiment.rating)}`}
                        size="small"
                        sx={{
                          backgroundColor: getSentimentColor(item.sentiment.rating),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.summary}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Source: {item.source} | {new Date(item.datetime * 1000).toLocaleDateString()}
                        </Typography>
                        {item.url && (
                          <Typography variant="caption" color="primary" sx={{ ml: 2 }}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              Read more →
                            </a>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < news.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SentimentDashboard;
