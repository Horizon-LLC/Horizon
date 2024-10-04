import './MainPage.css';
import React, { useState, useRef } from 'react';
import { Button, Card, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, ScrollShadow } from '@nextui-org/react';

import Feed from './Feed';

const HomePage = ({loggedInUser}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [message, setMessage] = useState('');  
    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });
    const maxChar = 10000;         
    const feedRefresh = useRef(null);   
    
    const messageLengthCheck = (e) => {
        if (e.target.value.length <= maxChar) {
            setMessage(e.target.value);
        }
    };

    const showErrorMess = (text, type) => {
        setAlertModal({ isOpen: true, text, type });
    };

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return new Date(date).toLocaleString(undefined, options);
    };

    const createPost = async () => {
        if (!message) {
            showErrorMess('Post content cannot be empty', 'error');
            return;
        }
        const token = localStorage.getItem('token'); 

        try {
            const currentDateTime = formatDate(new Date());
            console.log(currentDateTime);
            const response = await fetch('http://127.0.0.1:5000/create-post', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({ content: message, created_at: currentDateTime }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('');
                feedRefresh.current.refresh();
            } else {
                showErrorMess(data.error || 'Failed to create post', 'error');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showErrorMess('Something went wrong while creating the post', 'error');
        }
    };




    return (
        <div className='main-container'>
            <Card className='center-container'>
                <div className='feed-top'>
                    <Button color="primary" className="max-w-xs" onClick={onOpen}>
                        Create Post
                    </Button>
                </div>
                <div className='feed-bottom'>
                    <ScrollShadow hideScrollBar>
                    <Feed ref={feedRefresh} />
                    </ScrollShadow>
                </div>
            </Card>
            <Spacer x={5} />
            <Card className='side-container'>
                <Button color="primary" className="max-w-xs">
                    User Page
                </Button>
            </Card>

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
                                <p className='charCountText' >{message.length} / {maxChar} characters</p>
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
            <Modal isOpen={alertModal.isOpen} onOpenChange={() => setAlertModal({ ...alertModal, isOpen: false })} hideCloseButton>
                <ModalContent>
                    <ModalHeader>
                        <h2>{alertModal.type === 'error' ? 'Error' : 'Success'}</h2>
                    </ModalHeader>
                    <ModalBody>
                        <p>{alertModal.text}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button auto onClick={() => setAlertModal({ ...alertModal, isOpen: false })}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default HomePage;
