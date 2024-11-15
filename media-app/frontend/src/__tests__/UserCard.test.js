import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import UserCard from '../assets/components/UserCard';

describe('UserCard', () => {
    test('renders user information correctly', () => {
        const mockFollowUser = jest.fn();
    
        const user = {
          user_id: 1,
          username: 'fastfox',
        };
    
        render(
          <MemoryRouter>
            <UserCard user={user} followUser={mockFollowUser} />
          </MemoryRouter>
        );
    
        expect(screen.getByText('TestUser')).toBeInTheDocument();
    
        const followButton = screen.getByRole('button', { name: /Follow/i });
        fireEvent.click(followButton);
    
        expect(mockFollowUser).toHaveBeenCalledWith(1);
      });

      test('calls followUser function with the correct user ID when "Follow" button is clicked', () => {
        const mockFollowUser = jest.fn();
    
        const user = {
          user_id: 1,
          username: 'fastfox',
        };
    
        render(
          <MemoryRouter>
            <UserCard user={user} followUser={mockFollowUser} />
          </MemoryRouter>
        );
    
        const followButton = screen.getByRole('button', { name: /Follow/i });
        fireEvent.click(followButton);
    
        expect(mockFollowUser).toHaveBeenCalledTimes(1);
        expect(mockFollowUser).toHaveBeenCalledWith(1);
      });
});
