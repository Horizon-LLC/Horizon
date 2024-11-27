import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AllUserList from '../assets/components/AllUserList';

// Mock UserCard 
jest.mock('../assets/components/UserCard', () => {
    return ({ user, followUser }) => (
      <div>
        {user.username}
        <button onClick={() => followUser(user.user_id)}>Follow</button>
      </div>
    );
  });
  
  describe('AllUserList', () => {
    test('renders users correctly and follow button is displayed', () => {
      const mockUsers = [
        { user_id: 1, username: 'John Doe' },
        { user_id: 2, username: 'Jane Smith' },
      ];
  
      const mockFollowUser = jest.fn();
  
      render(
        <MemoryRouter>
          <AllUserList users={mockUsers} followUser={mockFollowUser} />
        </MemoryRouter>
      );
  
      mockUsers.forEach((user) => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
      });
  
      const followButtons = screen.getAllByRole('button', { name: /Follow/i });
      expect(followButtons).toHaveLength(mockUsers.length); 
  
    });
  });