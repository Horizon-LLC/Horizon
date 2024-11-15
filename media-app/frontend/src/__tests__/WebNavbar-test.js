import React from 'react';  // Add this import
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // For routing context
import { WebNavbar } from '../assets/components/WebNavbar';
import { useLocation } from 'react-router-dom';

// Mock the `useLocation` hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('WebNavbar', () => {
  it('should render the navbar when not on Login or Signup page', () => {
    useLocation.mockReturnValue({ pathname: '/Home' }); // Mock the location to simulate being on the Home page

    const loggedInUser = "Test";
    
    render(
      <BrowserRouter>
        <WebNavbar />
      </BrowserRouter>
    );

    // Check that the navbar is rendered
    expect(screen.getByText('HORIZON')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();
    expect(screen.getByText('Database Test')).toBeInTheDocument();
    expect(screen.getByText('Entity Database')).toBeInTheDocument();
  });

  it('should not render the navbar on Login or Signup pages', () => {
    useLocation.mockReturnValue({ pathname: '/Login' }); // Mock the location to simulate being on the Login page
    
    const { container } = render(
      <BrowserRouter>
        <WebNavbar />
      </BrowserRouter>
    );

    // Check that the navbar is not rendered
    expect(container.firstChild).toBeNull();
  });

  it('should render login button when user is not logged in', () => {
    useLocation.mockReturnValue({ pathname: '/Home' }); // Mock the location to simulate being on the Home page

    // Mock that the user is not logged in
    const loggedInUser = null;

    render(
      <BrowserRouter>
        <WebNavbar loggedInUser={loggedInUser} />
      </BrowserRouter>
    );

    // Check that the login link is rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should render user profile link when logged in', () => {
    useLocation.mockReturnValue({ pathname: '/Home' }); // Mock the location to simulate being on the Home page

    // Mock that the user is logged in
    const loggedInUser = 'John Doe';

    render(
      <BrowserRouter>
        <WebNavbar loggedInUser={loggedInUser} />
      </BrowserRouter>
    );

    // Check that the user profile link is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
