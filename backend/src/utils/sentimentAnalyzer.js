const Sentiment = require('sentiment');

class SentimentAnalyzer {
  constructor() {
    this.sentiment = new Sentiment();
  }

  analyzeText(text) {
    const result = this.sentiment.analyze(text);

    // Convert score to 1-5 scale
    const score = result.score;
    let rating = 3; // neutral

    if (score > 5) rating = 5; // very positive
    else if (score > 2) rating = 4; // positive
    else if (score < -5) rating = 1; // very negative
    else if (score < -2) rating = 2; // negative

    return {
      score: result.score,
      rating: rating,
      comparative: result.comparative,
      positive: result.positive,
      negative: result.negative,
      tokens: result.tokens
    };
  }

  analyzeNews(newsArray) {
    return newsArray.map(news => {
      // Handle both old format (headline, summary) and new format (headline, summary from API)
      const textToAnalyze = (news.headline || news.title || '') + ' ' + (news.summary || news.description || '');

      const analysis = this.analyzeText(textToAnalyze);

      return {
        ...news,
        sentiment: analysis
      };
    });
  }

  getOverallSentiment(newsArray) {
    if (newsArray.length === 0) {
      return { rating: 3, score: 0, count: 0 };
    }

    const totalScore = newsArray.reduce((sum, news) => sum + news.sentiment.score, 0);
    const averageScore = totalScore / newsArray.length;

    let rating = 3;
    if (averageScore > 2) rating = 4;
    else if (averageScore < -2) rating = 2;
    else if (averageScore > 5) rating = 5;
    else if (averageScore < -5) rating = 1;

    return {
      rating,
      score: averageScore,
      count: newsArray.length
    };
  }
}

module.exports = new SentimentAnalyzer();
