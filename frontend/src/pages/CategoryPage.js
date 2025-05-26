import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NewsList from '../components/NewsList';
import CategorySelector from '../components/CategorySelector';
import { getNewsByCategory } from '../services/api';
import '../styles/pages/CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        const data = await getNewsByCategory(category);
        setArticles(data);
      } catch (err) {
        console.error(`Error fetching ${category} news:`, err);
        setError(`Failed to load ${category} news. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryNews();
  }, [category]);
  
  // Format category name for display
  const formatCategoryName = (cat) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };
  
  return (
    <div className="category-page">
      <div className="container">
        <h2>{formatCategoryName(category)} News</h2>
        
        <div className="content-layout">
          <div className="main-content">
            {error && <div className="error-message">{error}</div>}
            <NewsList articles={articles} loading={loading} />
          </div>
          
          <aside className="sidebar">
            <CategorySelector />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
