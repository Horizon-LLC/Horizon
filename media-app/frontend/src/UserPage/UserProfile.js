import './UserPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, ScrollShadow } from '@nextui-org/react';
import API_BASE_URL from '../config'; 

const UserProfile = ({loggedInUser, loggedInUserId}) => {
    const { userId } = useParams();  
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

            const data = await response.json();
            if (response.ok) {
                navigate(`/chat/${data.chatbox_id}`, { state: {userId: userId, username: userData.username}});  
            } else {
                setError(data.error || 'Failed to create/fetch chatbox');
            }
        } catch (error) {
            setError('Something went wrong while creating or fetching the chatbox');
        }
    };
  
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
            </div>
            <div className='userbottom-container'>

            </div>
        </div>
    );
};
export default UserProfile;