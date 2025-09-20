const axios = require('axios');

// Test the API endpoints
const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint:');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test sentiment analysis for AAPL
    console.log('\n2. Testing sentiment analysis for AAPL:');
    const sentimentResponse = await axios.get(`${BASE_URL}/api/sentiment/AAPL`);
    console.log('✅ Sentiment data:', {
      symbol: sentimentResponse.data.symbol,
      overallSentiment: sentimentResponse.data.overallSentiment,
      newsCount: sentimentResponse.data.newsCount
    });

    // Test news endpoint for AAPL
    console.log('\n3. Testing news endpoint for AAPL:');
    const newsResponse = await axios.get(`${BASE_URL}/api/news/AAPL`);
    console.log('✅ News data:', {
      symbol: newsResponse.data.symbol,
      count: newsResponse.data.count,
      firstArticle: newsResponse.data.news[0]?.headline
    });

    console.log('\n🎉 All tests passed! The API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
