import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NewsList from '../components/NewsList';
import { searchNews } from '../services/api';
import '../styles/pages/SearchPage.css';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setArticles([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await searchNews(query);
        setArticles(data);
      } catch (err) {
        console.error('Error searching news:', err);
        setError('Failed to load search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h2>Search Results: "{query}"</h2>
          <p>{loading ? 'Searching...' : `${articles.length} results found`}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <NewsList articles={articles} loading={loading} />
      </div>
    </div>
  );
};

export default SearchPage;
