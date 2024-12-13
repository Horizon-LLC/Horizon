import './UserPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import React, { useEffect, useState } from 'react';
import { Button, Spacer, ScrollShadow } from '@nextui-org/react';
import API_BASE_URL from '../config';
import { fetchUserProfile } from '../handlers/UserHandler'; 
import UserPagePosts from '../assets/components/UserPagePosts';
import { openChatbox } from '../handlers/MessageHandler';

const UserProfile = ({ loggedInUser, loggedInUserId }) => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const [totalFriends, setTotalFriends] = useState(0);
    const [posts, setPosts] = useState([]);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);




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
        fetchUserProfile(userId, setUsername, setTotalPosts, setTotalFollowers, setTotalFollowing, setTotalFriends, setPosts, setLoading);
    }, [userId]);

    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div className="profile-container">
        <div className="profile-head">
            <div className="pfp">
                <img src={defaultProfilePic} alt="Profile" />
            </div>
            <div className="info">
                <div className='info-top'>
                <span className="username-text">{username}</span>
                <Button className="message-button" onClick={ () => openChatbox(loggedInUserId, userId, username, navigate)}> Message </Button>
                </div>
                <div className="info-line">
                    <h1 className="info-text">{totalPosts} Posts</h1>
                    <h1 className="info-text">{totalFollowers} Followers</h1>
                    <h1 className="info-text">{totalFollowing} Following</h1>
                    <h1 className="info-text" >
                    {totalFriends} Friends
                    </h1>
                </div>
            </div>
        </div>

        <Spacer y={8} />


        {/* Posts section */}
        <ScrollShadow hideScrollBar>
        <UserPagePosts posts={posts} totalPosts={totalPosts} loading={loading} />
        </ScrollShadow>

</div>
    );
};

export default UserProfile;
