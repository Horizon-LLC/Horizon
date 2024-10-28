import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './ProfilePage.css'; 
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import API_BASE_URL from '../config';

const ProfilePage = ({ setLoggedInUser }) => {
    const [username, setUsername] = useState(''); 
    const [totalPosts, setTotalPosts] = useState(0); 
    const [totalFollowers, setTotalFollowers] = useState(0); 
    const [totalFollowing, setTotalFollowing] = useState(0); 
    const [totalFriends, setTotalFriends] = useState(0); 
    const [friends, setFriends] = useState([]); 
    const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false); 
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',  
            });

            if (response.ok) {
                setLoggedInUser(null);
                localStorage.removeItem('token'); 
                navigate('/Login');
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); 
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username); 
                setTotalPosts(data.total_posts); 
                setTotalFollowers(data.total_followers); 
                setTotalFollowing(data.total_following); 
            } else {
                console.error('Failed to fetch profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchFriends = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await fetch(`${API_BASE_URL}/get-friends`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFriends(data.friends); 
                setTotalFriends(data.total_friends); 
            } else {
                console.error('Failed to fetch friends:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile(); 
        fetchFriends(); 
    }, []); 

    return (
        <div className="profile-container">
            <div className="profile-page">
                <div className="profile-head">
                    <div className="pfp">
                        <img src={defaultProfilePic} alt="Profile" /> 
                    </div>
                    <div className="info">
                        <span className="username-text">{username}</span> 
                        <button className="settings-button" onClick={toggleMenu}>
                            &#9776; 
                        </button>
                        <div className="info-line">
                            <span className="info-text">{totalPosts} Posts</span> 
                            <span className="info-text">{totalFollowers} Followers</span> 
                            <span className="info-text">{totalFollowing} Following</span> 
                            <span className="info-text" onClick={() => setIsFriendsModalOpen(true)} style={{ cursor: 'pointer' }}>
                                {totalFriends} Friends
                            </span> 
                        </div>
                        <div className="bio">Yo soy Dora.</div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="dropdown-menu">
                        <div className="profile-card1">
                            <button className="logout-button" onClick={handleLogout}>Log Out</button>
                            <button className="placeholder-button">Change Profile Picture</button>
                            <button className="placeholder-button">Update Bio</button>
                            <button className="deleteaccount-button">Delete Account</button>
                        </div>
                    </div>
                )}

                <div className="posts">
                    <div className="post">Post 1</div>
                    <div className="post">Post 2</div>
                    <div className="post">Post 3</div>
                </div>

                <div className="profile-header">
                    <h1 className="profile-header-text">Profile Page</h1>
                </div>

                {isFriendsModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3 className="modal-header">Friends List</h3>
                            <ul className="friend-list">
                                {friends.map(friend => (
                                    <li key={friend.user_id} className="friend-item">{friend.username}</li>
                                ))}
                            </ul>
                            <button className="modal-close-button" onClick={() => setIsFriendsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;