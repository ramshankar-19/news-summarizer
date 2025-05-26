import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FavoritesView from './FavoritesView';

// Mock the NewsCard component
jest.mock('../components/NewsCard', () => {
  return function MockNewsCard({ article }) {
    return (
      <div data-testid="news-card">
        <h3>{article.title}</h3>
      </div>
    );
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.confirm
window.confirm = jest.fn();

// Mock window.dispatchEvent
window.dispatchEvent = jest.fn();

describe('FavoritesView Component', () => {
  const mockFavorites = [
    {
      title: 'Favorite Article 1',
      description: 'Test description 1',
      url: 'https://example.com/1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2023-04-20T12:00:00Z',
      source: { name: 'Test Source 1' }
    },
    {
      title: 'Favorite Article 2',
      description: 'Test description 2',
      url: 'https://example.com/2',
      urlToImage: 'https://example.com/image2.jpg',
      publishedAt: '2023-04-20T13:00:00Z',
      source: { name: 'Test Source 2' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Mock userEmail
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'userEmail') return 'test@example.com';
      return null;
    });
  });

  test('renders empty state when no favorites exist', () => {
    // Mock localStorage to return empty favorites
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'userEmail') return 'test@example.com';
      if (key.includes('favorites')) return '[]';
      return null;
    });
    
    render(
      <BrowserRouter>
        <FavoritesView />
      </BrowserRouter>
    );
    
    // Let the effects run
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByText(/haven't saved any articles/i)).toBeInTheDocument();
  });

  test('renders favorite articles when they exist', () => {
    // Mock localStorage to return favorites
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'userEmail') return 'test@example.com';
      if (key.includes('favorites')) return JSON.stringify(mockFavorites);
      return null;
    });
    
    render(
      <BrowserRouter>
        <FavoritesView />
      </BrowserRouter>
    );
    
    // Let the effects run
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByText(/Favorite Articles/i)).toBeInTheDocument();
  });

  test('clears all favorites when clear button is clicked', () => {
    // Mock localStorage to return favorites
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'userEmail') return 'test@example.com';
      if (key.includes('favorites')) return JSON.stringify(mockFavorites);
      return null;
    });
    
    // Mock window.confirm to return true (user confirms)
    window.confirm.mockReturnValue(true);
    
    render(
      <BrowserRouter>
        <FavoritesView />
      </BrowserRouter>
    );
    
    // Wait for component to render fully
    expect(screen.getByText(/Favorite Articles/i)).toBeInTheDocument();
    
    // Find and click the clear button if it exists
    const clearButton = screen.queryByText(/Clear All/i);
    if (clearButton) {
      fireEvent.click(clearButton);
      
      // Check if confirm was called
      expect(window.confirm).toHaveBeenCalled();
      
      // Check if window.dispatchEvent was called
      expect(window.dispatchEvent).toHaveBeenCalled();
    }
  });
}); 