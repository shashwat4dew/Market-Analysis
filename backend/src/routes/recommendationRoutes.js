const express = require('express');
const router = express.Router();
const recommendationService = require('../services/recommendationService');
const sentimentAnalyzer = require('../utils/sentimentAnalyzer');
const mockNewsData = require('../../data/mockNewsData.json');

// GET /api/recommendations/:symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    // Get news data for the symbol
    const symbolNews = mockNewsData.filter(news =>
      news.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (symbolNews.length === 0) {
      return res.status(404).json({
        error: 'No news data found for the specified symbol',
        symbol: symbol
      });
    }

    // Analyze sentiment
    const analyzedNews = sentimentAnalyzer.analyzeNews(symbolNews);
    const overallSentiment = sentimentAnalyzer.getOverallSentiment(analyzedNews);

    const sentimentData = {
      symbol: symbol.toUpperCase(),
      overallSentiment,
      news: analyzedNews,
      newsCount: analyzedNews.length
    };

    // Generate recommendation
    const recommendation = await recommendationService.generateRecommendation(
      symbol,
      sentimentData,
      symbolNews
    );

    res.json(recommendation);
  } catch (error) {
    console.error('Error generating recommendation:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/recommendations/:symbol/summary
router.get('/:symbol/summary', async (req, res) => {
  try {
    const { symbol } = req.params;

    const symbolNews = mockNewsData.filter(news =>
      news.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (symbolNews.length === 0) {
      return res.status(404).json({
        error: 'No news data found for the specified symbol',
        symbol: symbol
      });
    }

    const analyzedNews = sentimentAnalyzer.analyzeNews(symbolNews);
    const overallSentiment = sentimentAnalyzer.getOverallSentiment(analyzedNews);

    const sentimentData = {
      symbol: symbol.toUpperCase(),
      overallSentiment,
      news: analyzedNews,
      newsCount: analyzedNews.length
    };

    const recommendation = await recommendationService.generateRecommendation(
      symbol,
      sentimentData,
      symbolNews
    );

    // Return only essential fields for summary
    const summary = {
      symbol: recommendation.symbol,
      recommendation: recommendation.recommendation,
      confidence: recommendation.confidence,
      llmOpinion: recommendation.llmOpinion,
      lastUpdated: recommendation.lastUpdated
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating recommendation summary:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/recommendations/market/overview
router.get('/market/overview', async (req, res) => {
  try {
    // Get all unique symbols
    const symbols = [...new Set(mockNewsData.map(news => news.symbol))];

    const marketOverview = await Promise.all(
      symbols.map(async (symbol) => {
        const symbolNews = mockNewsData.filter(news =>
          news.symbol.toLowerCase() === symbol.toLowerCase()
        );

        const analyzedNews = sentimentAnalyzer.analyzeNews(symbolNews);
        const overallSentiment = sentimentAnalyzer.getOverallSentiment(analyzedNews);

        const sentimentData = {
          symbol: symbol.toUpperCase(),
          overallSentiment,
          news: analyzedNews,
          newsCount: analyzedNews.length
        };

        const recommendation = await recommendationService.generateRecommendation(
          symbol,
          sentimentData,
          symbolNews
        );

        return {
          symbol: recommendation.symbol,
          recommendation: recommendation.recommendation,
          confidence: recommendation.confidence,
          sentiment: overallSentiment.rating,
          newsCount: analyzedNews.length
        };
      })
    );

    res.json({
      marketOverview,
      totalSymbols: symbols.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating market overview:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
