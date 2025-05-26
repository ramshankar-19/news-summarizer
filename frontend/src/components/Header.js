import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/components/Header.css';
import { IoMdSearch } from "react-icons/io";
import { FaUser, FaSignOutAlt, FaHeart, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check for user info in localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
    
    // Get favorites count
    updateFavoritesCount();
    
    // Listen for changes to favorites
    window.addEventListener('storage', updateFavoritesCount);
    
    return () => {
      window.removeEventListener('storage', updateFavoritesCount);
    }
  }, []);
  
  const updateFavoritesCount = () => {
    const userEmail = localStorage.getItem('userEmail');
    const favoritesKey = userEmail ? `favorites_${userEmail}` : 'favorites';
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    setFavoritesCount(favorites.length);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    // Redirect to login page
    navigate('/login');
  };

  const handleFavoritesClick = () => {
    navigate('/favorites-view');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/home">
            <span className="logo-text">NewsSummarizer</span>
          </Link>
        </div>
        
        <button className="mobile-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/category/business" onClick={() => setMenuOpen(false)}>Business</Link>
            </li>
            <li>
              <Link to="/category/technology" onClick={() => setMenuOpen(false)}>Technology</Link>
            </li>
            <li>
              <Link to="/category/sports" onClick={() => setMenuOpen(false)}>Sports</Link>
            </li>
            <li>
              <Link to="/category/science" onClick={() => setMenuOpen(false)}>Science</Link>
            </li>
            <li>
              <Link to="/category/health" onClick={() => setMenuOpen(false)}>Health</Link>
            </li>
            <li>
              <Link to="/category/entertainment" onClick={() => setMenuOpen(false)}>Entertainment</Link>
            </li>
            <li className="mobile-only">
              <form className="search-form mobile-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit"><IoMdSearch className="search-icon" size={20} /></button>
              </form>
            </li>
            {userEmail && (
              <>
                <li className="mobile-only">
                  <button className="nav-button" onClick={handleFavoritesClick}>
                    <FaHeart className="favorites-icon" /> 
                    Favorites {favoritesCount > 0 && <span>({favoritesCount})</span>}
                  </button>
                </li>
                <li className="mobile-only">
                  <button className="nav-button logout-nav" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="header-right">
          <form role="form" className="search-form desktop-only" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><IoMdSearch className="search-icon" size={20} /></button>
          </form>
          
          <button 
            className={`favorites-button ${location.pathname === '/favorites-view' ? 'active' : ''}`} 
            onClick={handleFavoritesClick}
            title="View favorites"
          >
            <FaHeart className="favorites-icon" />
            {favoritesCount > 0 && <span className="favorites-count">{favoritesCount}</span>}
          </button>
          
          {userEmail ? (
            <div className="auth-controls">
              <div className="user-display">
                <FaUser className="user-icon" />
                <span>{userEmail}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
