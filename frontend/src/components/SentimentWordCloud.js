import React, { useMemo } from "react";
import WordCloud from "react-d3-cloud";

const SentimentWordCloud = ({ news }) => {
  const words = useMemo(() => {
    if (!news || news.length === 0) return [];

    const wordMap = new Map();

    news.forEach((item) => {
      const text = (item.headline + " " + (item.summary || "")).toLowerCase();
      const wordList = text.match(/\b\w{4,}\b/g); // 4+ letters

      if (wordList) {
        wordList.forEach((word) => {
          if (
            ![
              "with","from","that","this","will","have","been","said",
              "each","which","their","what","were","when","where","there",
              "could","would","should","about","after","before","during",
              "while","under","over","into","onto","upon","within","without",
              "through","across","among","between","amongst"
            ].includes(word)
          ) {
            const count = wordMap.get(word) || 0;
            wordMap.set(word, count + 1);
          }
        });
      }
    });

    return Array.from(wordMap.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50)
      .map(item => ({
        text: item.text,
        value: Math.max(item.value * 100, 200) // Ensure minimum size
      }));
  }, [news]);

  if (words.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "#666",
        }}
      >
        No words to display
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <WordCloud
        data={words}
        width={400}
        height={300}
        font="Arial"
        fontSize={(word) => Math.min(word.value / 10, 60)}
        rotate={(word) => (word.value % 2) * 90}
        padding={5}
        fill={(d, i) => {
          const colors = [
            "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
            "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
          ];
          return colors[i % colors.length];
        }}
      />
    </div>
  );
};

export default SentimentWordCloud;
