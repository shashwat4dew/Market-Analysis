const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

// GET /api/news/:symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit = 10 } = req.query;

    const newsData = await newsService.fetchNewsBySymbol(symbol);

    if (newsData.length === 0) {
      return res.status(404).json({
        error: 'No news found for the specified symbol',
        symbol: symbol
      });
    }

    // Sort by datetime (most recent first) and limit results
    const sortedNews = newsData
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, parseInt(limit));

    res.json({
      symbol: symbol.toUpperCase(),
      news: sortedNews,
      count: sortedNews.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/news - Get all market news
router.get('/', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const newsData = await newsService.fetchMarketNews();

    // Sort by datetime (most recent first) and limit results
    const sortedNews = newsData
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, parseInt(limit));

    res.json({
      news: sortedNews,
      count: sortedNews.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching all news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/news/general - Get general market news
router.get('/general/market', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const newsData = await newsService.fetchMarketNews();

    // Sort by datetime (most recent first) and limit results
    const sortedNews = newsData
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, parseInt(limit));

    res.json({
      market: 'General',
      news: sortedNews,
      count: sortedNews.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching general market news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
