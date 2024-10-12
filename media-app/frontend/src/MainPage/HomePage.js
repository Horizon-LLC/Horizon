import './MainPage.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Input, Button, Card, CardHeader, CardBody, CardFooter, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, ScrollShadow } from '@nextui-org/react';
import { CiSearch } from "react-icons/ci";
import Feed from './Feed';
import API_BASE_URL from '../config';

const HomePage = ({loggedInUser}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [message, setMessage] = useState('');  
    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });
    const [users, setUsers] = useState([]);
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
        return new Date(date).toISOString();  // Use ISO format for consistency
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
            const response = await fetch(`${API_BASE_URL}/create-post`, {
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

    const getAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                showErrorMess(data.error || 'Failed to get users', 'error');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showErrorMess('Something went wrong while getting users', 'error');
        }
    };


    useEffect(() => {
        getAllUsers(); 
    }, []);

    return (
        <div className='home-container'>
                <div className='center-container'>
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
                </div>
                <Spacer x={5} />
                <div className='side-container'>
                    <Input
                        label="Search"
                        isClearable
                        radius="lg"
                        className='search-box'
                        classNames={{
                        label: "text-black/50 dark:text-white/90",
                        input: [
                            "bg-transparent",
                            "text-black/90 dark:text-white/90",
                            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                            "shadow-xl",
                            "bg-default-200/50",
                            "dark:bg-default/60",
                            "backdrop-blur-xl",
                            "backdrop-saturate-200",
                            "hover:bg-default-200/70",
                            "dark:hover:bg-default/70",
                            "group-data-[focus=true]:bg-default-200/50",
                            "dark:group-data-[focus=true]:bg-default/60",
                            "!cursor-text",
                        ],
                        }}
                        placeholder="Type to search..."
                        startContent={
                        <CiSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                <Card className='profile-container'>
                    <ScrollShadow hideScrollBar>
                        {users.length > 0 ? (
                                users.map((user) => (
                                    <Card className='user-card' key={user.user_id} shadow='none'>
                                        <Link to={`/user/${user.user_id}`}>
                                        <p className='usercard-text'>{user.username}</p>
                                        </Link>
                                        <Button className='addfriend-button'>
                                            Friend
                                        </Button>
                                    </Card>
                                ))
                            ) : (
                                <p>No users found</p>
                            )}
                    </ScrollShadow>
                </Card>
            </div>

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
