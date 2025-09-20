import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NewsSentimentChart = ({ data }) => {
  // Mock data for different news sources
  const mockSources = [
    { name: 'Financial Times', positive: 8, negative: 2, neutral: 5 },
    { name: 'Reuters', positive: 6, negative: 4, neutral: 3 },
    { name: 'Bloomberg', positive: 7, negative: 1, neutral: 4 },
    { name: 'WSJ', positive: 5, negative: 3, neutral: 2 },
    { name: 'CNBC', positive: 4, negative: 5, neutral: 3 },
  ];

  const chartData = {
    labels: mockSources.map(source => source.name),
    datasets: [
      {
        label: 'Positive',
        data: mockSources.map(source => source.positive),
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
      {
        label: 'Negative',
        data: mockSources.map(source => source.negative),
        backgroundColor: 'rgba(244, 67, 54, 0.7)',
        borderColor: 'rgba(244, 67, 54, 1)',
        borderWidth: 1,
      },
      {
        label: 'Neutral',
        data: mockSources.map(source => source.neutral),
        backgroundColor: 'rgba(255, 152, 0, 0.7)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sentiment by News Source',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} articles`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'News Sources',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Number of Articles',
        },
        beginAtZero: true,
      },
    },
  };

  const getSourceSummary = () => {
    const mostPositive = mockSources.reduce((prev, current) =>
      (prev.positive - prev.negative) > (current.positive - current.negative) ? prev : current
    );

    const mostNegative = mockSources.reduce((prev, current) =>
      (prev.positive - prev.negative) < (current.positive - current.negative) ? prev : current
    );

    return { mostPositive, mostNegative };
  };

  const { mostPositive, mostNegative } = getSourceSummary();

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          News Source Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Sentiment distribution across different news sources
        </Typography>

        <Box sx={{ height: 350, position: 'relative' }}>
          <Bar data={chartData} options={options} />
        </Box>

        {/* Source Summary */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#e8f5e8', borderRadius: 1, flex: 1, mr: 1 }}>
            <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
              Most Positive
            </Typography>
            <Typography variant="body2">
              {mostPositive.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              +{mostPositive.positive - mostPositive.negative} net positive
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#ffebee', borderRadius: 1, flex: 1, ml: 1 }}>
            <Typography variant="body2" sx={{ color: 'error.dark', fontWeight: 'bold' }}>
              Most Negative
            </Typography>
            <Typography variant="body2">
              {mostNegative.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {mostNegative.positive - mostNegative.negative} net negative
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsSentimentChart;
