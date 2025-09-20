const axios = require('axios');

class RecommendationService {
  constructor() {
    this.llmApiKey =
      process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    this.llmProvider = process.env.LLM_PROVIDER || 'openai'; // 'openai' or 'anthropic'
  }

  async generateRecommendation(symbol, sentimentData, newsData) {
    try {
      const analysis = this.analyzeSentimentData(sentimentData, newsData);
      const llmOpinion = await this.getLLMOpinion(symbol, analysis);

      return {
        symbol: symbol.toUpperCase(),
        recommendation: this.generateRecommendationFromAnalysis(analysis),
        confidence: this.calculateConfidence(analysis),
        reasoning: analysis,
        llmOpinion,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating recommendation:', error);
      return this.getFallbackRecommendation(symbol, sentimentData);
    }
  }

  analyzeSentimentData(sentimentData, newsData) {
    const overallSentiment =
      sentimentData?.overallSentiment || { rating: 3, score: 0 };
    const news = sentimentData?.news || [];

    const positiveNews = news.filter((n) => n?.sentiment?.rating >= 4).length;
    const negativeNews = news.filter((n) => n?.sentiment?.rating <= 2).length;
    const neutralNews = news.filter((n) => n?.sentiment?.rating === 3).length;

    const wordAnalysis = this.analyzeWordPatterns(news);

    return {
      overallSentiment: overallSentiment.rating || 3,
      sentimentScore: overallSentiment.score || 0,
      newsCount: news.length,
      positiveNews,
      negativeNews,
      neutralNews,
      positiveRatio: news.length > 0 ? (positiveNews / news.length) * 100 : 0,
      negativeRatio: news.length > 0 ? (negativeNews / news.length) * 100 : 0,
      wordAnalysis,
      recentNews: news.slice(0, 5).map((n) => ({
        headline: n?.headline || n?.title || 'No headline',
        sentiment: n?.sentiment?.rating || 3,
        source: n?.source || 'Unknown',
      })),
    };
  }

  analyzeWordPatterns(news) {
    const wordMap = new Map();
    const positiveWords = [
      'surge',
      'soar',
      'gain',
      'profit',
      'growth',
      'beat',
      'exceed',
      'strong',
      'positive',
      'upgrade',
    ];
    const negativeWords = [
      'decline',
      'fall',
      'loss',
      'miss',
      'weak',
      'concern',
      'worry',
      'downgrade',
      'risk',
      'challenge',
    ];

    news.forEach((item) => {
      const text =
        (item?.headline || item?.title || '') +
        ' ' +
        (item?.summary || item?.description || '');
      const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];

      words.forEach((word) => {
        if (positiveWords.includes(word)) {
          wordMap.set(word, (wordMap.get(word) || 0) + 1);
        } else if (negativeWords.includes(word)) {
          wordMap.set(word, (wordMap.get(word) || 0) + 1);
        }
      });
    });

    return {
      positiveIndicators: Array.from(wordMap.entries())
        .filter(([word]) => positiveWords.includes(word))
        .sort((a, b) => b[1] - a[1]),
      negativeIndicators: Array.from(wordMap.entries())
        .filter(([word]) => negativeWords.includes(word))
        .sort((a, b) => b[1] - a[1]),
    };
  }

  generateRecommendationFromAnalysis(analysis) {
    const { overallSentiment, positiveRatio, negativeRatio, wordAnalysis } =
      analysis;

    let score = 0;

    // Sentiment (40%)
    score += (overallSentiment - 3) * 20;

    // News ratio (30%)
    score += (positiveRatio - negativeRatio) * 0.3;

    // Word indicators (30%)
    let wordScore = 0;
    if (wordAnalysis) {
      const positiveWords = wordAnalysis.positiveIndicators.reduce(
        (sum, [, count]) => sum + count,
        0
      );
      const negativeWords = wordAnalysis.negativeIndicators.reduce(
        (sum, [, count]) => sum + count,
        0
      );
      wordScore = positiveWords - negativeWords;
    }
    score += wordScore * 10;

    if (score >= 30) return 'STRONG_BUY';
    if (score >= 10) return 'BUY';
    if (score >= -10) return 'HOLD';
    if (score >= -30) return 'SELL';
    return 'STRONG_SELL';
  }

  calculateConfidence(analysis) {
    const { newsCount, positiveRatio, negativeRatio } = analysis;
    let confidence = 50;

    if (newsCount >= 10) confidence += 20;
    else if (newsCount >= 5) confidence += 10;

    if (Math.abs(positiveRatio - negativeRatio) > 50) confidence += 15;
    else if (Math.abs(positiveRatio - negativeRatio) > 25) confidence += 10;

    return Math.min(confidence, 95);
  }

  async getLLMOpinion(symbol, analysis) {
    if (!this.llmApiKey) {
      return this.getFallbackOpinion(analysis);
    }

    try {
      const prompt = this.createPrompt(symbol, analysis);

      if (this.llmProvider === 'openai') {
        return await this.callOpenAI(prompt);
      } else if (this.llmProvider === 'anthropic') {
        return await this.callAnthropic(prompt);
      }

      return this.getFallbackOpinion(analysis);
    } catch (error) {
      console.error('LLM API error:', error);
      return this.getFallbackOpinion(analysis);
    }
  }

  createPrompt(symbol, analysis) {
    return `You are a professional financial analyst. Based on the following market data for ${symbol}, provide a brief investment opinion (2-3 sentences):

Market Data:
- Overall Sentiment: ${analysis.overallSentiment}/5 (${
      analysis.sentimentScore > 0
        ? 'Positive'
        : analysis.sentimentScore < 0
        ? 'Negative'
        : 'Neutral'
    })
- News Analysis: ${analysis.positiveNews} positive, ${analysis.negativeNews} negative, ${analysis.neutralNews} neutral articles
- Positive Indicators: ${
      analysis.wordAnalysis?.positiveIndicators
        ?.slice(0, 3)
        .map(([word, count]) => `${word}(${count})`)
        .join(', ') || 'None'
    }
- Negative Indicators: ${
      analysis.wordAnalysis?.negativeIndicators
        ?.slice(0, 3)
        .map(([word, count]) => `${word}(${count})`)
        .join(', ') || 'None'
    }

Recent Headlines:
${analysis.recentNews
  .map((n) => `- ${n.headline} (${n.sentiment}/5)`)
  .join('\n')}

Provide a concise investment opinion considering this data.`;
  }

  async callOpenAI(prompt) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${this.llmApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  }

  async callAnthropic(prompt) {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 150,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': this.llmApiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.content[0].text.trim();
  }

  getFallbackOpinion(analysis) {
    const { overallSentiment, positiveRatio, negativeRatio } = analysis;

    if (overallSentiment >= 4) {
      return `Strong positive sentiment (${overallSentiment}/5) with ${positiveRatio.toFixed(
        1
      )}% positive news coverage suggests favorable market conditions. Consider buying.`;
    } else if (overallSentiment <= 2) {
      return `Negative sentiment (${overallSentiment}/5) with ${negativeRatio.toFixed(
        1
      )}% negative news coverage indicates market concerns. Caution advised.`;
    } else {
      return `Mixed sentiment (${overallSentiment}/5) with balanced news coverage suggests holding until clearer signals emerge.`;
    }
  }

  getFallbackRecommendation(symbol, sentimentData) {
    return {
      symbol: symbol.toUpperCase(),
      recommendation: 'HOLD',
      confidence: 50,
      reasoning: {
        overallSentiment: sentimentData?.overallSentiment?.rating || 3,
        sentimentScore: sentimentData?.overallSentiment?.score || 0,
        newsCount: sentimentData?.news?.length || 0,
        error: 'Service temporarily unavailable',
      },
      llmOpinion:
        'Unable to generate AI opinion at this time. Using fallback analysis.',
      lastUpdated: new Date().toISOString(),
    };
  }
}

module.exports = new RecommendationService();
