import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components/CategorySelector.css';

const CategorySelector = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const categories = [
    { id: 'general', name: 'General', path: '/' },
    { id: 'business', name: 'Business', path: '/category/business' },
    { id: 'technology', name: 'Technology', path: '/category/technology' },
    { id: 'sports', name: 'Sports', path: '/category/sports' },
    { id: 'entertainment', name: 'Entertainment', path: '/category/entertainment' },
    { id: 'science', name: 'Science', path: '/category/science' },
    { id: 'health', name: 'Health', path: '/category/health' }
  ];
  
  return (
    <div className="category-selector">
      <h3>News Categories</h3>
      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id}>
            <Link 
              to={category.path} 
              className={currentPath === category.path ? 'active' : ''}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelector;
