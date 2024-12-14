import './UserPage.css';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserPage.css';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import { Button, useDisclosure, Spacer } from '@nextui-org/react';
import FriendsListModal from '../assets/components/FriendsListModal';
import UserPostsFeed from '../assets/components/UserPostsFeed';
import API_BASE_URL from '../config';
import { addFriend } from '../handlers/FollowHandler';
import { fetchUserData } from '../handlers/UserHandler';
import { chatboxDirect } from '../handlers/MessageHandler';

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

    useEffect(() => {
        fetchUserData(userId, setError, setUsername, setBio, setProfilePic, setTotalPosts, setTotalFollowers, setTotalFollowing);
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
                <Button className='addfriend-button' onPress={() => chatboxDirect(loggedInUserId, userId, username, navigate, setError)}> Message </Button>
                <Spacer x={5} />
                <Button className='addfriend-button' onPress={() => addFriend(userId, setError)}> Follow </Button>
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
