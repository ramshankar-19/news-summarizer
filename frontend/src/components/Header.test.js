import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

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

// Mock navigation
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({ pathname: '/home' }),
}));

// Mock window.dispatchEvent
window.dispatchEvent = jest.fn();

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test('renders logo and navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Check if logo is rendered
    expect(screen.getByText(/NewsSummarizer/i)).toBeInTheDocument();
    
    // Check if navigation links are rendered
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Business/i)).toBeInTheDocument();
    expect(screen.getByText(/Technology/i)).toBeInTheDocument();
  });

  test('displays login link when user is not logged in', () => {
    localStorageMock.getItem.mockImplementation(() => null);
    
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('displays user info and logout button when user is logged in', () => {
    // Set up localStorage with user email
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'userEmail') return 'test@example.com';
      return null;
    });
    
    render(
      <BrowserRouter>
        <Header userEmail="test@example.com" />
      </BrowserRouter>
    );
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('search form navigates correctly', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Get the search input and form
    const searchForm = screen.getByRole('form');
    const searchInputs = screen.getAllByPlaceholderText(/Search news/i);
    const searchInput = searchInputs[0]; // Use the desktop search form
    
    // Type in search query
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Submit the form
    fireEvent.submit(searchForm);
    
    // Check if navigate was called with correct path
    expect(mockedNavigate).toHaveBeenCalledWith('/search?q=test%20query');
  });
}); 