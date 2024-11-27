import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';
import { messageLengthCheck, createPost } from '../../handlers/PostHandler';



const PostModal = ({ isOpen, onOpenChange, feedRefresh, setAlertModal }) => {
    const maxChar = 10000; 
       
    const [message, setMessage] = useState('');   

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader >
                            <h2>Create a New Post</h2>
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
                            <Button auto flat color="danger" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button auto color='primary' onClick={() => {
                                createPost(message, setMessage, feedRefresh, setAlertModal);
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
