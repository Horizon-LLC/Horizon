import '@testing-library/jest-dom';
import React, {useState} from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useDisclosure } from '@nextui-org/react';
import PostModal from '../assets/components/PostModal';
import CreatePostButton from '../assets/components/CreatePostButton';

const TestComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const maxChar = 250;
  
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
  
    const createPost = () => {
      console.log(message);
    };
  
    return (
      <>
        <CreatePostButton onOpen={onOpen} />
        <PostModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          message={message}
          setMessage={setMessage}
          maxChar={maxChar}
          createPost={createPost}
          onClose={onClose}
        />
      </>
    );
  };
  
  describe('PostModal', () => {
    test('renders correctly when opened', async () => {
      render(<TestComponent />);
  
      const button = screen.getByText(/Create Post/i);
      fireEvent.click(button);
  
      await waitFor(() => {
        const modalHeader = screen.getByRole('heading', { name: /Create a New Post/i });
        expect(modalHeader).toBeInTheDocument();
      });
    });
  
    test('typing in the message input updates the message state', async () => {
      render(<TestComponent />);
  
      fireEvent.click(screen.getByText(/Create Post/i));
  
      const input = screen.getByPlaceholderText(/Write your message here.../i);
      fireEvent.change(input, { target: { value: 'New Post' } });
  
      expect(input.value).toBe('New Post');
    });
  
    

    test('submit creates a post', async () => {
        const createPost = jest.fn();
      
        function Wrapper() {
          const [message, setMessage] = useState('');
          return (
            <PostModal
              isOpen={true}
              onOpenChange={() => {}}
              createPost={createPost}
              message={message}
              setMessage={setMessage}
              maxChar={280}
            />
          );
        }
      
        render(<Wrapper />);
      
        const input = screen.getByPlaceholderText(/Write your message here.../i);
        fireEvent.change(input, { target: { value: 'My new post' } });
      
        expect(input.value).toBe('My new post'); 
      
        const postButton = screen.getByRole('button', { name: /Post/i });
        fireEvent.click(postButton); 
      
        expect(createPost).toHaveBeenCalledTimes(1);
        expect(createPost).toHaveBeenCalledWith('My new post');
      });
      
  });