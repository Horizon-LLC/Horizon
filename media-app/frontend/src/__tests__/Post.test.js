import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Post from '../assets/components/Post'; 

describe('Post', () => {
    const post = {
      userid: 'testuser',
      content: 'This is a test post.',
      created_at: '2024-11-15T10:00:00Z',
    };
    const mockUpvote = jest.fn();
    const mockDownvote = jest.fn();
  
    test('renders post content correctly', () => {
      render(<Post post={post} index={0} />);
  
      expect(screen.getByText('testuser')).toBeInTheDocument();
  
      expect(screen.getByText('This is a test post.')).toBeInTheDocument();
  
      expect(screen.getByText(/Posted on:/i)).toBeInTheDocument();
  
      expect(screen.getByText(/11\/15\/2024/i)).toBeInTheDocument(); 
  
      expect(screen.getByText(/2:00:00 AM/i)).toBeInTheDocument(); 

    });

    test('renders upvote and downvote buttons', () => {
      render(<Post post={post} index={1} />);
  
      const upvoteButton = screen.getByRole('button', { name: /Upvote/i });
      expect(upvoteButton).toBeInTheDocument();
  
      const downvoteButton = screen.getByRole('button', { name: /Downvote/i });
      expect(downvoteButton).toBeInTheDocument();
    });
  
    test('calls upvotePost when Upvote button is clicked', () => {
      render(
        <Post
          post={post}
          index={1}
          upvotePost={mockUpvote}
          downvotePost={mockDownvote}
        />
      );
    
      const upvoteButton = screen.getByRole('button', { name: /Upvote/i });
      fireEvent.click(upvoteButton);
      expect(mockUpvote).toHaveBeenCalledTimes(1); 
    });
    
    test('calls downvotePost when Downvote button is clicked', () => {
      render(
        <Post
          post={post}
          index={1}
          upvotePost={mockUpvote}
          downvotePost={mockDownvote}
        />
      );
    
      const downvoteButton = screen.getByRole('button', { name: /Downvote/i });
      fireEvent.click(downvoteButton);
      expect(mockDownvote).toHaveBeenCalledTimes(1); 
    });
  
  });
