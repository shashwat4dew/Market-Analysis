import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentDistributionChart = ({ data }) => {
  if (!data || !data.reasoning) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sentiment Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { positiveNews, negativeNews, neutralNews } = data.reasoning;
  const total = positiveNews + negativeNews + neutralNews;

  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [positiveNews, negativeNews, neutralNews],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',   // Green for positive
          'rgba(244, 67, 54, 0.8)',   // Red for negative
          'rgba(255, 152, 0, 0.8)',   // Orange for neutral
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(255, 152, 0, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sentiment Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Based on {total} analyzed news articles
        </Typography>
        <Box sx={{ height: 300, position: 'relative' }}>
          <Pie data={chartData} options={options} />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'success.main' }}>
              {positiveNews}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Positive
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'error.main' }}>
              {negativeNews}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Negative
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'warning.main' }}>
              {neutralNews}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Neutral
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentimentDistributionChart;
