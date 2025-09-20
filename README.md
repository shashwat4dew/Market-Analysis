# Market Sentiment Dashboard

A real-time financial sentiment analysis dashboard built with React (frontend) and Node.js/Express (backend). This application analyzes news sentiment for stocks and funds using natural language processing and real news APIs.

## Features

- **Real-time Sentiment Analysis**: Analyze sentiment of financial news in real-time
- **Interactive Dashboard**: Clean, responsive UI built with Material-UI
- **Word Cloud Visualization**: Visual representation of frequently mentioned words
- **Stock Symbol Search**: Enter any stock symbol to get sentiment analysis
- **Auto-refresh**: Data updates every 30 minutes automatically
- **Sentiment Scoring**: 1-5 scale sentiment rating with visual indicators
- **Real News Integration**: Connect to real news APIs for live data

## Tech Stack

### Backend
- Node.js
- Express.js
- Sentiment analysis using 'sentiment' library
- RESTful API endpoints
- Real news API integration

### Frontend
- React 18
- Material-UI (MUI) for components
- React Word Cloud for visualization
- Axios for API calls

## Project Structure

```
market-sentiment-dashboard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── sentimentRoutes.js
│   │   │   └── newsRoutes.js
│   │   ├── services/
│   │   │   └── newsService.js
│   │   ├── utils/
│   │   │   └── sentimentAnalyzer.js
│   │   └── server.js
│   ├── data/
│   │   └── mockNewsData.json
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── SentimentDashboard.js
│   │   │   └── SentimentWordCloud.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Real News API Integration

The application supports integration with real news APIs:

### Supported APIs

1. **Finnhub** - Financial market news and company-specific news (recommended)
2. **Alpha Vantage** - Financial market news and sentiment
3. **NewsAPI** - General news and articles
4. **Free News APIs** - Various free news sources

### Setup Instructions

1. **Get API Keys:**
   - Sign up for [Finnhub](https://finnhub.io/) (recommended for financial news)
   - Sign up for [Alpha Vantage](https://www.alphavantage.co/)
   - Sign up for [NewsAPI](https://newsapi.org/)
   - Or use other free news APIs from the [GitHub repository](https://github.com/free-news-api/news-api)

2. **Configure Environment Variables:**
   Edit `backend/.env` and add your API keys:
   ```env
   NEWS_API_KEY=your-news-api-key-here
   ALPHA_VANTAGE_KEY=your-alpha-vantage-key-here
   FINNHUB_API_KEY=your-finnhub-api-key-here
   ```

   **Note:** The application will automatically use Finnhub API first (if configured), then fall back to Alpha Vantage, and finally use mock data if no real APIs are configured.

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Sentiment Analysis
- `GET /api/sentiment/:symbol` - Get detailed sentiment analysis for a stock symbol
- `GET /api/sentiment/:symbol/summary` - Get sentiment summary for a stock symbol
- `GET /api/sentiment/general/market` - Get general market sentiment

### News Data
- `GET /api/news/:symbol` - Get news articles for a specific stock symbol
- `GET /api/news` - Get all news articles
- `GET /api/news/general/market` - Get general market news

### Health Check
- `GET /api/health` - Check if the API is running

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Enter a stock symbol (e.g., AAPL, TSLA, MSFT) in the search box
3. Click "Analyze Sentiment" to get the sentiment analysis
4. View the overall sentiment score, word cloud, and individual news articles with sentiment ratings
5. The dashboard will automatically refresh every 30 minutes

## Sample Data Structure

The application expects news data in this format:
```json
{
  "category": "technology",
  "datetime": 1596589501,
  "headline": "Square surges after reporting 64% jump in revenue",
  "id": 5085164,
  "image": "https://image.cnbcfm.com/api/v1/image/105569283-1542050972462rts25mct.jpg?v=1542051069",
  "related": "",
  "source": "CNBC",
  "summary": "Shares of Square soared on Tuesday evening after posting better-than-expected quarterly results",
  "url": "https://www.cnbc.com/2020/08/04/square-sq-earnings-q2-2020.html"
}
```

## Sentiment Analysis

The sentiment analysis uses the 'sentiment' library to analyze text and provides:
- Score: Raw sentiment score
- Rating: 1-5 scale rating
- Positive/Negative word counts
- Comparative analysis

## Development

### Adding New Features
- Backend API routes go in `backend/src/routes/`
- Frontend components go in `frontend/src/components/`
- Utility functions go in `backend/src/utils/`
- News services go in `backend/src/services/`

### Testing
- Backend: `npm test` (in backend directory)
- Frontend: `npm test` (in frontend directory)

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
