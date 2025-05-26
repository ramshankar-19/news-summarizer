import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>NewsSum</h3>
          <p>Get the latest news with AI-powered summaries. Stay informed without information overload.</p>
        </div>
        
        <div className="footer-column">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/category/business">Business</Link></li>
            <li><Link to="/category/technology">Technology</Link></li>
            <li><Link to="/category/sports">Sports</Link></li>
            <li><Link to="/category/entertainment">Entertainment</Link></li>
            <li><Link to="/category/science">Science</Link></li>
            <li><Link to="/category/health">Health</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">News API</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NewsSum. All rights reserved.</p>
        <p>Powered by <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">News API</a></p>
      </div>
    </footer>
  );
};

export default Footer;
