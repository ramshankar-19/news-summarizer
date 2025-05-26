import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './styles/App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import FavoritesView from './pages/FavoritesView';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app">
      {!isLoginPage && <Header />}
      <main className={isLoginPage ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/favorites-view" element={<FavoritesView />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;








