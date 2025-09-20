const axios = require('axios');

// Test the API endpoints
async function testAPI() {
  const baseURL = 'http://localhost:5000';

  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health:', healthResponse.data);

    // Test sentiment endpoint
    console.log('\n2. Testing sentiment endpoint for AAPL...');
    const sentimentResponse = await axios.get(`${baseURL}/api/sentiment/AAPL`);
    console.log('✅ Sentiment:', {
      symbol: sentimentResponse.data.symbol,
      sentiment: sentimentResponse.data.overallSentiment,
      newsCount: sentimentResponse.data.newsCount
    });

    // Test recommendation endpoint
    console.log('\n3. Testing recommendation endpoint for AAPL...');
    const recommendationResponse = await axios.get(`${baseURL}/api/recommendations/AAPL`);
    console.log('✅ Recommendation:', {
      symbol: recommendationResponse.data.symbol,
      recommendation: recommendationResponse.data.recommendation,
      confidence: recommendationResponse.data.confidence,
      llmOpinion: recommendationResponse.data.llmOpinion.substring(0, 100) + '...'
    });

    // Test news endpoint
    console.log('\n4. Testing news endpoint for AAPL...');
    const newsResponse = await axios.get(`${baseURL}/api/news/AAPL`);
    console.log('✅ News:', {
      symbol: newsResponse.data.symbol,
      count: newsResponse.data.count
    });

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   cd backend && npm run dev');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
