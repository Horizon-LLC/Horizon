import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../assets/components/SearchBar';

describe('SearchBar', () => {
    it('renders correctly', () => {
        render(<SearchBar />);

        expect(screen.getByPlaceholderText(/Type to search.../i)).toBeInTheDocument();
    });

    it('handles user input', () => {
        render(<SearchBar />);

        const inputField = screen.getByPlaceholderText(/Type to search.../i);
        fireEvent.change(inputField, { target: { value: 'React' } });

        expect(inputField.value).toBe('React');
    });

    test('searching for another user', () => {
        render(
          <MemoryRouter>
            <SearchBar />
          </MemoryRouter>
        );
    
        const searchInput = screen.getByPlaceholderText(/Search for a user/i); 
        fireEvent.change(searchInput, { target: { value: 'Jane Smith' } });
    

        expect(screen.getByText('Jane Smith')).toBeInTheDocument(); 
      });
});
