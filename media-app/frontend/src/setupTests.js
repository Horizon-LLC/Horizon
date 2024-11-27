// src/setupTests.js

// Import jest-dom for custom matchers
import '@testing-library/jest-dom';

// Import jest-fetch-mock to mock fetch requests
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

// You may want to clear fetch mock states between tests to ensure no conflicts
beforeEach(() => {
  fetchMock.resetMocks();
});

// If you're using react-router, you might mock window.location if necessary
// Example:
// delete window.location;
// window.location = { href: '', pathname: '/', replace: jest.fn() };

// Mock console.error to catch any unexpected errors during testing
// This helps keep your test output clean
const consoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/ReactDOM.render is no longer supported in React 18/.test(args[0])) {
      return; // suppress specific error
    }
    consoleError(...args);
  };
});

afterAll(() => {
  console.error = consoleError; // restore original console.error
});
