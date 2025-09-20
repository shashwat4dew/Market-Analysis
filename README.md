# Market Sentiment Dashboard

A comprehensive real-time market sentiment analysis dashboard with AI-powered investment recommendations. Built with React (frontend) and Node.js/Express (backend).

## 🚀 Features

### 📊 **Visual Analytics**
- **Sentiment Distribution Chart**: Pie chart showing positive/negative/neutral sentiment breakdown
- **Confidence Gauge**: Visual confidence meter for analysis reliability
- **Sentiment Trend Chart**: Historical sentiment analysis over 7 days
- **News Source Analysis**: Bar chart comparing sentiment across different news sources
- **Interactive Word Cloud**: Visual representation of frequently mentioned terms

### 🤖 **AI-Powered Features**
- **Investment Recommendations**: AI-generated buy/sell/hold recommendations
- **LLM Integration**: Support for OpenAI GPT and Anthropic Claude
- **Sentiment Analysis**: Advanced text analysis using natural language processing
- **Confidence Scoring**: Data quality-based confidence metrics

### 📈 **Real-Time Data**
- **Live Updates**: Automatic refresh every 30 minutes
- **Multi-Stock Support**: Analyze any publicly traded stock
- **News Aggregation**: Real-time financial news integration
- **Social Media Sentiment**: (Framework ready for expansion)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI** - Professional UI components
- **Chart.js** - Interactive data visualizations
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sentiment.js** - Text sentiment analysis
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
market-sentiment-dashboard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── sentimentRoutes.js
│   │   │   ├── newsRoutes.js
│   │   │   └── recommendationRoutes.js
│   │   ├── services/
│   │   │   ├── recommendationService.js
│   │   │   └── newsService.js
│   │   ├── utils/
│   │   │   └── sentimentAnalyzer.js
│   │   └── server.js
│   ├── data/
│   │   └── mockNewsData.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SentimentDashboard.js
│   │   │   ├── SentimentWordCloud.js
│   │   │   ├── SentimentDistributionChart.js
│   │   │   ├── ConfidenceGauge.js
│   │   │   ├── SentimentTrendChart.js
│   │   │   ├── NewsSentimentChart.js
│   │   │   ├── RecommendationCard.js
│   │   │   └── Header.js
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project directory:**
   ```bash
   cd market-sentiment-dashboard
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

4. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

### Alternative: Use the startup scripts

**Windows:**
```bash
./start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file in the backend directory for LLM integration:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
LLM_PROVIDER=openai

# OR Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
LLM_PROVIDER=anthropic
```

## 📊 API Endpoints

### Sentiment Analysis
- `GET /api/sentiment/:symbol` - Get sentiment analysis for a stock
- `GET /api/sentiment/:symbol/summary` - Get sentiment summary
- `GET /api/news/:symbol` - Get news for a stock
- `GET /api/news` - Get all news
- `GET /api/recommendations/:symbol` - Get AI investment recommendations

### Health Check
- `GET /api/health` - Check API status

## 🎯 Usage

1. **Enter a Stock Symbol**: Type symbols like `AAPL`, `TSLA`, `MSFT`, `AMZN`
2. **Click "Analyze Sentiment"**: Get comprehensive market analysis
3. **View Results**:
   - Overall sentiment score (1-5 scale)
   - AI-powered investment recommendation
   - Interactive charts and visualizations
   - Detailed news analysis with sentiment indicators
   - Word cloud of key terms

## 📈 Sample Data

The application includes mock data for testing:
- Apple Inc. (AAPL)
- Tesla Inc. (TSLA)
- Microsoft Corp. (MSFT)
- Amazon.com Inc. (AMZN)
- Netflix Inc. (NFLX)
- Meta Platforms (META)
- NVIDIA Corp. (NVDA)
- Alphabet Inc. (GOOGL)

## 🔍 Features in Detail

### Sentiment Analysis
- **Text Processing**: Advanced NLP using Sentiment.js
- **Multi-factor Scoring**: Combines news sentiment, word analysis, and trend data
- **Real-time Updates**: Automatic refresh every 30 minutes
- **Historical Trends**: 7-day sentiment history with trend analysis

### Visual Analytics
- **Interactive Charts**: Built with Chart.js for smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional UI**: Material-UI components for consistent design
- **Data Visualization**: Multiple chart types for comprehensive analysis

### AI Integration
- **LLM Support**: OpenAI GPT and Anthropic Claude integration
- **Investment Insights**: AI-generated market commentary
- **Confidence Metrics**: Data quality-based confidence scoring
- **Fallback Analysis**: Robust error handling with fallback recommendations

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend not loading:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **API connection issues:**
   - Ensure backend is running on port 5000
   - Check CORS settings
   - Verify proxy configuration in frontend package.json

4. **Charts not displaying:**
   - Install chart dependencies: `npm install chart.js react-chartjs-2`
   - Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Sentiment Analysis**: Powered by Sentiment.js
- **Charts**: Built with Chart.js
- **UI Components**: Material-UI
- **Icons**: Material Icons
- **LLM Integration**: OpenAI and Anthropic APIs

---

**Built with ❤️ for financial market analysis**
