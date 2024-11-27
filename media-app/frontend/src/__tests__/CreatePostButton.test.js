import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreatePostButton from '../assets/components/CreatePostButton';
import '@testing-library/jest-dom';

describe('CreatePostButton', () => {
  test('renders the button with correct text', () => {

    const onOpen = jest.fn(); 

    render(<CreatePostButton onOpen={onOpen} />);

    const button = screen.getByText(/Create Post/i);
    expect(button).toBeInTheDocument(); 
  });

  test('calls onOpen when clicked', () => {
    const onOpen = jest.fn(); 

    render(<CreatePostButton onOpen={onOpen} />);

    const button = screen.getByText(/Create Post/i); 
    fireEvent.click(button);

    expect(onOpen).toHaveBeenCalledTimes(1); 
  });
});
