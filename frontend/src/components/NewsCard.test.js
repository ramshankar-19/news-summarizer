import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsCard from './NewsCard';
import { summarizeArticle } from '../services/api';

// Mock the API module
jest.mock('../services/api', () => ({
  summarizeArticle: jest.fn()
}));

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

describe('NewsCard Component', () => {
  const mockArticle = {
    title: 'AI Technology Advances',
    description: 'New developments in artificial intelligence technology are transforming industries worldwide.',
    url: 'https://example.com/article',
    urlToImage: 'https://example.com/image.jpg',
    publishedAt: '2023-04-20T12:00:00Z',
    source: { name: 'Tech News' }
  };

  // Create mock functions for speech synthesis
  const mockSpeak = jest.fn();
  const mockCancel = jest.fn();
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage properly
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    
    // Use Object.defineProperty to mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Mock speechSynthesis without redefining the property
    if (!window.speechSynthesis) {
      window.speechSynthesis = {};
    }
    window.speechSynthesis.speak = mockSpeak;
    window.speechSynthesis.cancel = mockCancel;
    
    // Mock SpeechSynthesisUtterance
    global.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => ({
      onend: null
    }));
  });

  test('renders article details correctly', () => {
    render(<NewsCard article={mockArticle} />);
    
    expect(screen.getByText('AI Technology Advances')).toBeInTheDocument();
    expect(screen.getByText('New developments in artificial intelligence technology are transforming industries worldwide.')).toBeInTheDocument();
    expect(screen.getByText('20 April 2023')).toBeInTheDocument();
  });

  test('generates summary when generate summary button is clicked', async () => {
    // Mock the API response
    summarizeArticle.mockResolvedValueOnce({
      status: 'success',
      data: {
        summary: 'This is a real AI-generated summary of the article about AI technology advances.',
        category: 'technology'
      }
    });
    
    render(<NewsCard article={mockArticle} />);
    
    // Click generate summary button
    fireEvent.click(screen.getByText(/Generate AI Summary/i));
    
    // Check if button text changes to loading state
    expect(screen.getByText(/Summarizing/i)).toBeInTheDocument();
    
    // Wait for the summary to be generated
    await waitFor(() => {
      expect(screen.getByText(/AI Summary:/i)).toBeInTheDocument();
      expect(screen.getByText(/This is a real AI-generated summary/i)).toBeInTheDocument();
    });
    
    // Verify the button text changed
    expect(screen.getByText(/Read Full Summary/i)).toBeInTheDocument();
    
    // Verify the API was called with the correct parameters
    expect(summarizeArticle).toHaveBeenCalledWith(
      'AI Technology Advances. New developments in artificial intelligence technology are transforming industries worldwide.'
    );
  });

  test('toggles summary expansion when clicking read full summary button', async () => {
    // Mock the API response
    summarizeArticle.mockResolvedValueOnce({
      status: 'success',
      data: {
        summary: 'This is a real AI-generated summary of the article about AI technology advances. It contains multiple sentences to demonstrate the expansion functionality.',
        category: 'technology'
      }
    });
    
    render(<NewsCard article={mockArticle} />);
    
    // Generate summary first
    fireEvent.click(screen.getByText(/Generate AI Summary/i));
    
    // Wait for summary to appear
    await waitFor(() => {
      expect(screen.getByText(/AI Summary:/i)).toBeInTheDocument();
    });
    
    // Click to expand
    fireEvent.click(screen.getByText(/Read Full Summary/i));
    
    // Verify button text changed
    expect(screen.getByText(/Show Less/i)).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(screen.getByText(/Show Less/i));
    
    // Verify button text changed back
    expect(screen.getByText(/Read Full Summary/i)).toBeInTheDocument();
  });

  test('handles API error when generating summary', async () => {
    // Mock the API error
    summarizeArticle.mockRejectedValueOnce(new Error('API error'));
    
    render(<NewsCard article={mockArticle} />);
    
    // Click generate summary button
    fireEvent.click(screen.getByText(/Generate AI Summary/i));
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Unable to generate summary/i)).toBeInTheDocument();
    });
  });

  test('handles API response with error status', async () => {
    // Mock the API response with error status
    summarizeArticle.mockResolvedValueOnce({
      status: 'error',
      message: 'Failed to generate summary'
    });
    
    render(<NewsCard article={mockArticle} />);
    
    // Click generate summary button
    fireEvent.click(screen.getByText(/Generate AI Summary/i));
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Unable to generate summary/i)).toBeInTheDocument();
    });
  });

  test('toggles favorite status when clicking favorite button', () => {
    // Mock localStorage.getItem to return an empty array
    window.localStorage.getItem.mockReturnValueOnce(null);
    
    render(<NewsCard article={mockArticle} />);
    
    // Initially not favorite
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
    
    // Click to add to favorites
    fireEvent.click(screen.getByText(/Save/i));
    
    // Now should be favorite
    expect(screen.getByText(/Saved/i)).toBeInTheDocument();
    
    // Verify localStorage.setItem was called
    expect(window.localStorage.setItem).toHaveBeenCalled();
    
    // Click again to remove from favorites
    fireEvent.click(screen.getByText(/Saved/i));
    
    // Back to not favorite
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });

  test('plays audio when clicking listen button', () => {
    render(<NewsCard article={mockArticle} />);
    
    // Initially not playing
    expect(screen.getByText(/Listen/i)).toBeInTheDocument();
    
    // Click to start audio
    fireEvent.click(screen.getByText(/Listen/i));
    
    // Now should be playing
    expect(screen.getByText(/Stop Audio/i)).toBeInTheDocument();
    
    // Verify speechSynthesis.speak was called
    expect(mockSpeak).toHaveBeenCalled();
    
    // Click again to stop audio
    fireEvent.click(screen.getByText(/Stop Audio/i));
    
    // Back to not playing
    expect(screen.getByText(/Listen/i)).toBeInTheDocument();
    
    // Verify speechSynthesis.cancel was called
    expect(mockCancel).toHaveBeenCalled();
  });
}); 