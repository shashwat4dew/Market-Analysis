const express = require('express');
const router = express.Router();
const sentimentAnalyzer = require('../utils/sentimentAnalyzer');
const newsService = require('../services/newsService');

// GET /api/sentiment/:symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    // Fetch news data from the service
    const newsData = await newsService.fetchNewsBySymbol(symbol);

    if (newsData.length === 0) {
      return res.status(404).json({
        error: 'No news found for the specified symbol',
        symbol: symbol
      });
    }

    // Analyze sentiment for each news item
    const analyzedNews = sentimentAnalyzer.analyzeNews(newsData);

    // Get overall sentiment
    const overallSentiment = sentimentAnalyzer.getOverallSentiment(analyzedNews);

    res.json({
      symbol: symbol.toUpperCase(),
      overallSentiment,
      newsCount: analyzedNews.length,
      news: analyzedNews,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sentiment/:symbol/summary
router.get('/:symbol/summary', async (req, res) => {
  try {
    const { symbol } = req.params;

    const newsData = await newsService.fetchNewsBySymbol(symbol);

    if (newsData.length === 0) {
      return res.status(404).json({
        error: 'No news found for the specified symbol',
        symbol: symbol
      });
    }

    const analyzedNews = sentimentAnalyzer.analyzeNews(newsData);
    const overallSentiment = sentimentAnalyzer.getOverallSentiment(analyzedNews);

    res.json({
      symbol: symbol.toUpperCase(),
      overallSentiment,
      newsCount: analyzedNews.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in sentiment summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sentiment/general - Get general market sentiment
router.get('/general/market', async (req, res) => {
  try {
    const newsData = await newsService.fetchMarketNews();

    if (newsData.length === 0) {
      return res.status(404).json({
        error: 'No market news found'
      });
    }

    const analyzedNews = sentimentAnalyzer.analyzeNews(newsData);
    const overallSentiment = sentimentAnalyzer.getOverallSentiment(analyzedNews);

    res.json({
      market: 'General',
      overallSentiment,
      newsCount: analyzedNews.length,
      news: analyzedNews,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in general market sentiment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
