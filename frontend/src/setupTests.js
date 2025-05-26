// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock timer functions
jest.useFakeTimers();

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver;

// Suppress React Router warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('React Router') || 
       args[0].includes('Future Flag Warning') ||
       args[0].includes('v7_relativeSplatPath'))) {
    return;
  }
  originalConsoleWarn(...args);
};

// Additional cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Add missing TextEncoder for Node environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

// Add missing TextDecoder for Node environment
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
} 