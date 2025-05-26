import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import '../styles/pages/FavoritesView.css';
import { FaTrash } from 'react-icons/fa';

const FavoritesView = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const favoritesKey = userEmail ? `favorites_${userEmail}` : 'favorites';
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    
    // Listen for storage events to update favorites in real-time
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      const userEmail = localStorage.getItem('userEmail');
      const favoritesKey = userEmail ? `favorites_${userEmail}` : 'favorites';
      localStorage.removeItem(favoritesKey);
      setFavorites([]);
      window.dispatchEvent(new Event('storage'));
    }
  };

  if (loading) {
    return <div className="favorites-view"><p className="loading-message">Loading favorites...</p></div>;
  }

  return (
    <div className="favorites-view">
      <div className="favorites-header">
        <h1>Your Favorite Articles</h1>
        {favorites.length > 0 && (
          <button className="clear-favorites-btn" onClick={clearAllFavorites}>
            <FaTrash /> Clear All
          </button>
        )}
      </div>
      
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>You haven't saved any articles yet.</p>
          <p>Click the heart icon on any article to add it to your favorites.</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView; 