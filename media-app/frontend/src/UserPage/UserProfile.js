import './UserPage.css';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserPage.css';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import { Button, useDisclosure, Spacer } from '@nextui-org/react';
import FriendsListModal from '../assets/components/FriendsListModal';
import UserPagePosts from '../assets/components/UserPagePosts';
import UserPostsFeed from '../assets/components/UserPostsFeed';
import API_BASE_URL from '../config';

const UserProfile = ({ loggedInUser, loggedInUserId }) => {
    const { userId } = useParams();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const navigate = useNavigate();
    const feedRefresh = useRef(null);
    const { isOpen: isFriendsOpen, onOpen: onFriendsOpen, onOpenChange: onFriendsOpenChange } = useDisclosure();

    const [error, setError] = useState(null);

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
                setUsername(data.username);
                setBio(data.bio || 'No bio available');
                setProfilePic(data.profile_pic || defaultProfilePic);
                setTotalPosts(data.total_posts);
                setTotalFollowers(data.total_followers);
                setTotalFollowing(data.total_following);
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
            navigate(`/chat/${chatboxId}`, { state: { userId, username } });
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

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="center-container-profile">
            <div className="profile-head">
                <div className="pfp">
                    <img
                        className='image'
                        src={profilePic}
                        alt="Profile"
                    />
                </div>
                <div className="info">
                    <span className="username-text">{username}</span>
                    <div className="info-line">
                        <span className="info-text">{totalPosts} Posts</span>
                        <span className="info-text">{totalFollowers} Followers</span>
                        <span className="info-text">{totalFollowing} Following</span>
                    </div>
                    <div className="bio">{bio}</div>
                </div>
            </div>

            <div className="usertop-container">
                <Button className='addfriend-button' onClick={chatboxDirect}> Message </Button>
                <Spacer x={5} />
                <Button className='addfriend-button' onClick={addFriend}> Follow </Button>
            </div>

            <div className="feed-bottom">
                <UserPostsFeed
                    ref={feedRefresh}
                    userId={userId} // Ensure only this user's posts are shown
                />
            </div>

            <FriendsListModal isOpen={isFriendsOpen} onOpenChange={onFriendsOpenChange} />
        </div>
    );
};

export default UserProfile;
