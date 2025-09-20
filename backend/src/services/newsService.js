const axios = require('axios');

class NewsService {
  constructor() {
    // You can add your API keys here
    this.apiKeys = {
      newsApi: process.env.NEWS_API_KEY || 'your-news-api-key',
      alphaVantage: process.env.ALPHA_VANTAGE_KEY || 'your-alpha-vantage-key',
      finnhub: process.env.FINNHUB_API_KEY || 'your-finnhub-api-key'
    };
  }

  async fetchMarketNews(symbol = null) {
    try {
      // Try Finnhub API first (most relevant for financial news)
      if (this.apiKeys.finnhub && this.apiKeys.finnhub !== 'your-finnhub-api-key') {
        const finnhubData = await this.fetchFromFinnhub(symbol);
        if (finnhubData.length > 0) {
          return finnhubData;
        }
      }

      // Fallback to Alpha Vantage
      if (this.apiKeys.alphaVantage && this.apiKeys.alphaVantage !== 'your-alpha-vantage-key') {
        const alphaVantageData = await this.fetchFromAlphaVantage(symbol);
        if (alphaVantageData.length > 0) {
          return alphaVantageData;
        }
      }

      // Final fallback to mock data
      return this.getMockNewsData(symbol);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Return mock data as final fallback
      return this.getMockNewsData(symbol);
    }
  }

  async fetchNewsBySymbol(symbol) {
    try {
      return await this.fetchMarketNews(symbol);
    } catch (error) {
      console.error('Error fetching news by symbol:', error);
      return this.getMockNewsData(symbol);
    }
  }

  // Finnhub API Integration
  async fetchFromFinnhub(symbol = null) {
    try {
      let url;
      if (symbol) {
        // Company-specific news
        url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2024-01-01&to=${new Date().toISOString().split('T')[0]}&token=${this.apiKeys.finnhub}`;
      } else {
        // General market news
        url = `https://finnhub.io/api/v1/news?category=general&token=${this.apiKeys.finnhub}`;
      }

      const response = await axios.get(url);

      return response.data.map(item => ({
        category: item.category || 'general',
        datetime: new Date(item.datetime || item.published_utc).getTime() / 1000,
        headline: item.headline || item.title,
        id: item.id || item.source + '-' + Date.now(),
        image: item.image || item.image_url || 'https://via.placeholder.com/300x200',
        related: item.related || '',
        source: item.source || 'Finnhub',
        summary: item.summary || item.description || '',
        url: item.url || item.article_url || ''
      }));
    } catch (error) {
      console.error('Error fetching from Finnhub:', error);
      return [];
    }
  }

  // Method to integrate with real News API
  async fetchFromNewsAPI(query = 'stocks') {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          apiKey: this.apiKeys.newsApi,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20
        }
      });

      return response.data.articles.map(article => ({
        category: 'general',
        datetime: new Date(article.publishedAt).getTime() / 1000,
        headline: article.title,
        id: article.source.id + '-' + Date.now(),
        image: article.urlToImage,
        related: '',
        source: article.source.name,
        summary: article.description,
        url: article.url
      }));
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
      return [];
    }
  }

  // Method to integrate with Alpha Vantage for market news
  async fetchFromAlphaVantage(symbol) {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'NEWS_SENTIMENT',
          tickers: symbol,
          apikey: this.apiKeys.alphaVantage,
          limit: 10
        }
      });

      if (response.data.feed) {
        return response.data.feed.map(item => ({
          category: 'market',
          datetime: new Date(item.time_published).getTime() / 1000,
          headline: item.title,
          id: item.title.replace(/\s+/g, '-'),
          image: item.banner_image || 'https://via.placeholder.com/300x200',
          related: '',
          source: item.source,
          summary: item.summary,
          url: item.url
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching from Alpha Vantage:', error);
      return [];
    }
  }

  // Mock data as fallback
  getMockNewsData(symbol = null) {
    return [
      {
        "category": "technology",
        "datetime": Math.floor(Date.now() / 1000),
        "headline": `${symbol || 'Market'} Reports Strong Quarterly Performance`,
        "id": Date.now(),
        "image": "https://via.placeholder.com/300x200",
        "related": "",
        "source": "Financial Times",
        "summary": `Latest market analysis shows positive momentum for ${symbol || 'major stocks'} with increased investor confidence.`,
        "url": "https://example.com/news"
      },
      {
        "category": "business",
        "datetime": Math.floor(Date.now() / 1000) - 3600,
        "headline": "Economic Indicators Point to Growth",
        "id": Date.now() - 1,
        "image": "https://via.placeholder.com/300x200",
        "related": "",
        "source": "Reuters",
        "summary": "Recent economic data suggests continued expansion in key sectors.",
        "url": "https://example.com/news2"
      }
    ];
  }
}

module.exports = new NewsService();
