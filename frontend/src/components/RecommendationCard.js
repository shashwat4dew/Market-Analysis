import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Divider,
  Alert
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';

const RecommendationCard = ({ recommendation }) => {
  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'STRONG_BUY': return '#4caf50';
      case 'BUY': return '#8bc34a';
      case 'HOLD': return '#ff9800';
      case 'SELL': return '#f44336';
      case 'STRONG_SELL': return '#d32f2f';
      default: return '#9e9e9e';
    }
  };

  const getRecommendationIcon = (rec) => {
    switch (rec) {
      case 'STRONG_BUY':
      case 'BUY':
        return <TrendingUpIcon sx={{ color: getRecommendationColor(rec) }} />;
      case 'SELL':
      case 'STRONG_SELL':
        return <TrendingDownIcon sx={{ color: getRecommendationColor(rec) }} />;
      default:
        return <RemoveIcon sx={{ color: getRecommendationColor(rec) }} />;
    }
  };

  const getRecommendationLabel = (rec) => {
    switch (rec) {
      case 'STRONG_BUY': return 'Strong Buy';
      case 'BUY': return 'Buy';
      case 'HOLD': return 'Hold';
      case 'SELL': return 'Sell';
      case 'STRONG_SELL': return 'Strong Sell';
      default: return 'Unknown';
    }
  };

  if (!recommendation) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Investment Recommendation
          </Typography>
          <Alert severity="info">
            Enter a stock symbol and click "Analyze Sentiment" to get AI-powered investment recommendations.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Investment Recommendation
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getRecommendationIcon(recommendation.recommendation)}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h4" sx={{ color: getRecommendationColor(recommendation.recommendation) }}>
              {getRecommendationLabel(recommendation.recommendation)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confidence: {recommendation.confidence}%
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={recommendation.confidence}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getRecommendationColor(recommendation.recommendation),
              borderRadius: 4,
            }
          }}
        />

        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
          "{recommendation.llmOpinion}"
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Analysis Details:
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={`Sentiment: ${recommendation.reasoning.overallSentiment}/5`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${recommendation.reasoning.newsCount} News Articles`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${recommendation.reasoning.positiveRatio.toFixed(1)}% Positive`}
            size="small"
            variant="outlined"
            color={recommendation.reasoning.positiveRatio > 50 ? "success" : "default"}
          />
        </Box>

        {recommendation.reasoning.wordAnalysis.positiveIndicators.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="success.main">
              Positive Indicators: {recommendation.reasoning.wordAnalysis.positiveIndicators.slice(0, 3).map(([word, count]) => `${word}(${count})`).join(', ')}
            </Typography>
          </Box>
        )}

        {recommendation.reasoning.wordAnalysis.negativeIndicators.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="error.main">
              Negative Indicators: {recommendation.reasoning.wordAnalysis.negativeIndicators.slice(0, 3).map(([word, count]) => `${word}(${count})`).join(', ')}
            </Typography>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Last updated: {new Date(recommendation.lastUpdated).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
