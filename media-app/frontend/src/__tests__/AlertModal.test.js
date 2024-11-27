import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertModal from '../assets/components/AlertModal';

describe('AlertModal', () => {
    test('renders correctly when opened with success type', () => {
        render(
          <AlertModal isOpen={true} text="Test Message" type="success" onClose={() => {}} />
        );
    
        expect(screen.getByRole('heading', { name: /Success/i })).toBeInTheDocument();
        expect(screen.getByText(/Test Message/i)).toBeInTheDocument();
      });
    
      test('renders correctly when opened with error type', () => {
        render(
          <AlertModal isOpen={true} text="An error occurred" type="error" onClose={() => {}} />
        );
    
        expect(screen.getByRole('heading', { name: /Error/i })).toBeInTheDocument();
        expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
      });
    
      test('calls onClose when the close button is clicked', () => {
        const onCloseMock = jest.fn();
    
        render(
          <AlertModal isOpen={true} text="Test Message" type="success" onClose={onCloseMock} />
        );
    
        const closeButton = screen.getByRole('button', { name: /Close/i });
        fireEvent.click(closeButton);
    
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
});
