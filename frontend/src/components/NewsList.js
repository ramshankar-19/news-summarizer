import React from 'react';
import NewsCard from './NewsCard';
import '../styles/components/NewsList.css';

const NewsList = ({ articles, loading }) => {
  if (loading) {
    return (
      <div className="news-list loading">
        <div className="spinner"></div>
        <p>Loading news articles...</p>
      </div>
    );
  }
  
  if (!articles || articles.length === 0) {
    return (
      <div className="news-list empty">
        <p>No articles found. Try a different search term or category.</p>
      </div>
    );
  }
  
  return (
    <div className="news-list">
      {articles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </div>
  );
};

export default NewsList;
