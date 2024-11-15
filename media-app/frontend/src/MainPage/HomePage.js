// HomePage.js
import './MainPage.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { Input, Button, Card, ScrollShadow, Spacer, useDisclosure } from '@nextui-org/react';
import { CiSearch } from "react-icons/ci";
import Feed from './Feed';
import PostModal from '../assets/components/PostModal';
import AlertModal from '../assets/components/AlertModal';
import SearchBar from '../assets/components/SearchBar';
import AllUserList from '../assets/components/AllUserList';
import CreatePostButton from '../assets/components/CreatePostButton';
import API_BASE_URL from '../config';

const HomePage = ({ loggedInUser, setLoggedInUser, setLoggedInUserId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

    const createPost = async (message) => {
        if (!message) {
            showErrorMess('Post content cannot be empty', 'error');
            return;
        }
        const token = localStorage.getItem('token'); 

        try {
            const currentDateTime = formatDate(new Date());
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

    const getAllUsers = useCallback(async () => {
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
            console.error('Error fetching users:', error);
            showErrorMess('Something went wrong while getting users', 'error');
        }
    }, []);

    const followUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/add-friend`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();
            if (response.ok) {
                showErrorMess('Friend added successfully', 'success');
            } else {
                showErrorMess(data.error || 'Failed to add friend', 'error');
            }
        } catch (error) {
            console.error('Error following user:', error);
            showErrorMess('Something went wrong while following the user', 'error');
        }
    };

    useEffect(() => {
        getAllUsers(); 
    }, [getAllUsers]);

    return (
        <div className='home-container' >
            <div className='center-container'>
                <div className='feed-top'>
                    <CreatePostButton onOpen={onOpen} />
                </div>
                <div className='feed-bottom'>
                    <ScrollShadow hideScrollBar>
                        <Feed ref={feedRefresh} />
                    </ScrollShadow>
                </div>
            </div>
            <Spacer x={5} />
            <div className='side-container'>
                <SearchBar className="search-box" />
                <AllUserList users={users} followUser={followUser} />
            </div>

            <PostModal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                message={message} 
                setMessage={setMessage} 
                maxChar={maxChar} 
                createPost={createPost} 
            />

            <AlertModal 
                isOpen={alertModal.isOpen} 
                text={alertModal.text} 
                type={alertModal.type} 
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
            />
        </div>
    );
};

export default HomePage;
