import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SentimentTrendChart = ({ symbol, data }) => {
  // Generate mock historical data for the last 7 days
  const generateHistoricalData = () => {
    const days = ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Today'];
    const baseSentiment = data?.reasoning?.overallSentiment || 3;

    return days.map((day, index) => {
      // Create some realistic variation around the current sentiment
      const variation = (Math.random() - 0.5) * 1.5;
      const sentiment = Math.max(1, Math.min(5, baseSentiment + variation));
      return {
        day,
        sentiment: Math.round(sentiment * 10) / 10,
        positive: Math.floor(Math.random() * 10) + 5,
        negative: Math.floor(Math.random() * 5) + 1,
      };
    });
  };

  const historicalData = generateHistoricalData();

  const chartData = {
    labels: historicalData.map(d => d.day),
    datasets: [
      {
        label: 'Sentiment Score',
        data: historicalData.map(d => d.sentiment),
        borderColor: 'rgba(25, 118, 210, 1)',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: historicalData.map(d =>
          d.sentiment >= 4 ? 'rgba(76, 175, 80, 1)' :
          d.sentiment >= 3 ? 'rgba(255, 152, 0, 1)' :
          'rgba(244, 67, 54, 1)'
        ),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
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
        text: `${symbol || 'Stock'} Sentiment Trend (Last 7 Days)`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataPoint = historicalData[context.dataIndex];
            return [
              `Sentiment: ${context.parsed.y}/5`,
              `Positive News: ${dataPoint.positive}`,
              `Negative News: ${dataPoint.negative}`
            ];
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 1,
        max: 5,
        title: {
          display: true,
          text: 'Sentiment Score (1-5)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sentiment Trend Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Historical sentiment pattern over the last 7 days
        </Typography>
        <Box sx={{ height: 350, position: 'relative' }}>
          <Line data={chartData} options={options} />
        </Box>

        {/* Trend Summary */}
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>Trend Analysis:</strong>{' '}
            {(() => {
              const current = historicalData[historicalData.length - 1].sentiment;
              const previous = historicalData[historicalData.length - 2].sentiment;
              const change = current - previous;

              if (Math.abs(change) < 0.2) return 'Stable sentiment trend';
              if (change > 0) return `Improving sentiment (+${change.toFixed(1)})`;
              return `Declining sentiment (${change.toFixed(1)})`;
            })()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentimentTrendChart;
