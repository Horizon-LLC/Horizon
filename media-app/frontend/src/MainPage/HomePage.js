import './MainPage.css';
import React, { useState } from 'react';
import { Button, Card, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea } from '@nextui-org/react';

import Feed from './Feed';

const HomePage = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState('');  
    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });
    const maxChar = 10000;            
    
    const messageLengthCheck = (e) => {
        if (e.target.value.length <= maxChar) {
            setMessage(e.target.value);
        }
    };

    const showErrorMess = (text, type) => {
        setAlertModal({ isOpen: true, text, type });
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    const createPost = async () => {
        if (!message) {
            showErrorMess('Post content cannot be empty', 'error');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: message }),
            });

            const data = await response.json();
            if (response.ok) {
                const currentDateTime = formatDate(new Date().toISOString());
                setPosts([{ content: message, created_at: currentDateTime }, ...posts]); 
                setMessage('');
            } else {
                showErrorMess(data.error || 'Failed to create post', 'error');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showErrorMess('Something went wrong while creating the post', 'error');
        }
    };
    /* 
    fetch("/create-post", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data);  // Log the response
            if (data.message === 'Post Created successfully') {
                // Display the new post
                const postContainer = document.getElementById('posts-container');
                const newPost = document.createElement('div');
                newPost.className = "post";
                newPost.innerHTML = `<p>${data.post_content}</p><small>Just now</small>`;
                postContainer.prepend(newPost);  // Add the new post to the top
                document.getElementById('post-content').value = '';  // Clear the textarea
            } else {
                alert('Error creating post');
            }
        })
        .catch(error => console.error('Error:', error));
    }
        */

    return (
        <div className='main-container'>
            <Card className='side-container'>
                <Button color="primary" className="max-w-xs">
                    List
                </Button>
            </Card>
            <Spacer x={5} />
            <Card className='center-container'>
                <Button color="primary" className="max-w-xs" onClick={onOpen}>
                    Create Post
                </Button>
                <Feed  />
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
