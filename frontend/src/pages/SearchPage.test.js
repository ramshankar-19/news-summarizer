import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from './SearchPage';
import { searchNews } from '../services/api';

// Mock the API service
jest.mock('../services/api', () => ({
  searchNews: jest.fn(),
}));

// Mock the router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?q=test+query'
  }),
  BrowserRouter: ({ children }) => <div>{children}</div>
}));

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

describe('SearchPage Component', () => {
  const mockSearchResults = [
    {
      title: 'Search Result 1',
      description: 'Test description 1',
      url: 'https://example.com/1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2023-04-20T12:00:00Z',
      source: { name: 'Test Source 1' }
    },
    {
      title: 'Search Result 2',
      description: 'Test description 2',
      url: 'https://example.com/2',
      urlToImage: 'https://example.com/image2.jpg',
      publishedAt: '2023-04-20T13:00:00Z',
      source: { name: 'Test Source 2' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays search results when data is loaded', async () => {
    // Mock API to return search results
    searchNews.mockResolvedValue(mockSearchResults);
    
    render(<SearchPage />);
    
    // Wait for results to load
    await waitFor(() => {
      expect(screen.getAllByTestId('news-card').length).toBe(2);
    });
    
    // Check if API was called with the right query
    expect(searchNews).toHaveBeenCalledWith('test query');
  });

  test('shows no results message when API returns empty array', async () => {
    // Mock API to return empty results
    searchNews.mockResolvedValue([]);
    
    render(<SearchPage />);
    
    // Wait for no results message
    await waitFor(() => {
      expect(screen.getByText(/No articles found/i)).toBeInTheDocument();
    });
  });

  test('renders error message when API call fails', async () => {
    // Mock API to throw an error
    searchNews.mockRejectedValue(new Error('Failed to search articles'));
    
    render(<SearchPage />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load search results/i)).toBeInTheDocument();
    });
  });
}); 