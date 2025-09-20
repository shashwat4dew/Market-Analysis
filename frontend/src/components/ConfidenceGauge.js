import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ConfidenceGauge = ({ confidence = 0 }) => {
  const remainingConfidence = 100 - confidence;

  const chartData = {
    datasets: [
      {
        data: [confidence, remainingConfidence],
        backgroundColor: [
          confidence >= 70 ? 'rgba(76, 175, 80, 0.9)' : // Green for high confidence
          confidence >= 40 ? 'rgba(255, 152, 0, 0.9)' : // Orange for medium confidence
          'rgba(244, 67, 54, 0.9)', // Red for low confidence
          'rgba(224, 224, 224, 0.3)', // Light gray for remaining
        ],
        borderWidth: 0,
        cutout: '70%', // Makes it a gauge/donut chart
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90, // Start from top
    circumference: 180, // Half circle
    plugins: {
      legend: {
        display: false, // Hide legend for gauge
      },
      tooltip: {
        enabled: false, // Disable tooltips for cleaner look
      },
    },
  };

  const getConfidenceLevel = (conf) => {
    if (conf >= 80) return { level: 'Very High', color: 'success.main' };
    if (conf >= 60) return { level: 'High', color: 'success.light' };
    if (conf >= 40) return { level: 'Medium', color: 'warning.main' };
    if (conf >= 20) return { level: 'Low', color: 'error.light' };
    return { level: 'Very Low', color: 'error.main' };
  };

  const confidenceInfo = getConfidenceLevel(confidence);

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Analysis Confidence
        </Typography>

        <Box sx={{ height: 200, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Doughnut data={chartData} options={options} />

          {/* Center text */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" sx={{ color: confidenceInfo.color }}>
              {confidence}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {confidenceInfo.level}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Confidence Level: <strong>{confidenceInfo.level}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
            Based on data quality and analysis consistency
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConfidenceGauge;
