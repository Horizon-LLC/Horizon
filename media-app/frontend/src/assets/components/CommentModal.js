import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';
import { createComment } from '../../handlers/CommentHandler';

const CommentModal = ({ post_id, isOpen, onOpenChange, commentRefresh }) => {
    const maxChar = 10000; 
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token'); 

    const messageLengthCheck = (e, maxChar, setMessage) => {
        if (e.target.value.length <= maxChar) {
            setMessage(e.target.value);
        }
    };
    const handleCommentSubmit = async () => {
    if (message.trim()) {
      try {
        await createComment(token, post_id, message, commentRefresh);
        setMessage(''); 
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    } else {
      alert('Comment cannot be empty');
    }
  };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                <ModalHeader>
                <h2>Create a New Comment</h2>
                </ModalHeader>
                <ModalBody>
                <Textarea
                    label="Message"
                    placeholder="Write your message here..."
                    fullWidth
                    value={message}
                    onChange={(e) => messageLengthCheck(e, maxChar, setMessage)}
                    maxLength={maxChar}
                />
                <p className='charCountText'>{message.length} / {maxChar} characters</p>
                </ModalBody>
                <ModalFooter>
                <Button auto flat color="danger" onPress={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button auto color='primary' 
                    onPress={async () => {
                    await handleCommentSubmit();
                    onOpenChange(false);  
                    }}
                >
                    Comment
                </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CommentModal;

