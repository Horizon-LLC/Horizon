// PostModal.js
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';

const PostModal = ({ isOpen, onOpenChange, message, setMessage, maxChar, createPost }) => {
    const messageLengthCheck = (e) => {
        if (e.target.value.length <= maxChar) {
            setMessage(e.target.value);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h2>Create a New Post</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Textarea 
                                label="Message"
                                placeholder="Write your message here..." 
                                fullWidth 
                                value={message}
                                onChange={messageLengthCheck}
                                maxLength={maxChar}
                            />
                            <p className='charCountText'>{message.length} / {maxChar} characters</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button auto flat color="danger" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button auto color='primary' onClick={() => {
                                createPost();
                                onClose();
                            }}>
                                Post
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default PostModal;
