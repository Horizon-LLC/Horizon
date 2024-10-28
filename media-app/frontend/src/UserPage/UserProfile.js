import './UserPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import API_BASE_URL from '../config';

const UserProfile = ({ loggedInUser, loggedInUserId }) => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch the profile data for the specified user
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setUserData(data);
            } else {
                setError(data.error || 'Failed to fetch user data');
            }
        } catch (error) {
            setError('Something went wrong while fetching user data');
        }
    };

    // Creates or fetches a chatbox ID, then navigates to ChatPage
    const chatboxDirect = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/create-or-fetch-chatbox`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user1_id: loggedInUserId, user2_id: userId })
            });

            if (!response.ok) {
                throw new Error("Failed to create or fetch chatbox");
            }

            const data = await response.json();
            const chatboxId = data.chatbox_id;

            // Navigate to ChatPage with state
            navigate(`/chat/${chatboxId}`, { state: { userId, username: userData.username } });
        } catch (error) {
            setError('Something went wrong while creating or fetching the chatbox');
            console.error(error);
        }
    };

    // Adds a friend (follow request)
    const addFriend = async () => {
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
                alert('Follow request sent successfully!');
            } else {
                setError(data.error || 'Failed to send follow request');
            }
        } catch (error) {
            setError('Something went wrong while sending the follow request');
        }
    };

    // Initial data fetch for user profile
    useEffect(() => {
        fetchUserData();
    }, [userId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div className='userpage-container'>
            <div className='usertop-container'>
                <p className='username-text'>{userData.username}</p>
                <Button className='message-button' onClick={chatboxDirect}> Message </Button>
                <Button className='follow-button' onClick={addFriend}> Follow </Button>
            </div>
            <div className='userbottom-container'>
                {/* Additional user details can go here */}
            </div>
        </div>
    );
};

export default UserProfile;
