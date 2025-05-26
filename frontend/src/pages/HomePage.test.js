import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { getTopHeadlines } from '../services/api';

// Mock the API service
jest.mock('../services/api', () => ({
  getTopHeadlines: jest.fn(),
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

// Mock CategorySelector component
jest.mock('../components/CategorySelector', () => {
  return function MockCategorySelector() {
    return <div data-testid="category-selector">Category Selector</div>;
  };
});

describe('HomePage Component', () => {
  const mockArticles = [
    {
      title: 'Test Article 1',
      description: 'Test description 1',
      url: 'https://example.com/1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2023-04-20T12:00:00Z',
      source: { name: 'Test Source 1' }
    },
    {
      title: 'Test Article 2',
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

  test('renders loading state initially', () => {
    // Mock API to return a promise that doesn't resolve immediately
    getTopHeadlines.mockReturnValue(new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Check if loading message is displayed
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders news articles when data is loaded', async () => {
    // Mock API to return articles
    getTopHeadlines.mockResolvedValue(mockArticles);
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for articles to load
    await waitFor(() => {
      expect(screen.getAllByTestId('news-card').length).toBe(2);
    });
    
    // Check if article titles are displayed
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    // Mock API to throw an error
    getTopHeadlines.mockRejectedValue(new Error('Failed to fetch articles'));
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load news/i)).toBeInTheDocument();
    });
  });
}); 