import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './ProfilePage.css'; 
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import API_BASE_URL from '../config';

const ProfilePage = ({ setLoggedInUser }) => {
    const [username, setUsername] = useState(''); // State to store the username
    const [totalPosts, setTotalPosts] = useState(0); // State to store total posts
    const [totalFollowers, setTotalFollowers] = useState(0); // State to store total followers
    const [totalFollowing, setTotalFollowing] = useState(0); // State to store total following
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage dropdown visibility
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',  // Include session cookies
            });

            if (response.ok) {
                setLoggedInUser(null);
                navigate('/Login');
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the dropdown menu visibility
    };

    // Fetch user profile
    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Use the actual token
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username); // Set the username
                setTotalPosts(data.total_posts); // Set total posts
                setTotalFollowers(data.total_followers); 
                setTotalFollowing(data.total_following); 
            } else {
                console.error('Failed to fetch profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile(); // Fetch the user profile
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
                            &#9776; {/* Three-line hamburger icon */}
                        </button>
                        <div className="info-line">
                            <span className="info-text">{totalPosts} Posts</span> 
                            <span className="info-text">{totalFollowers} Followers</span> 
                            <span className="info-text">{totalFollowing} Following</span> 
                        </div>
                        <div className="bio">Yo soy Dora.</div>
                    </div>
                </div>

                {/* Dropdown Menu for Settings */}
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
            </div>
        </div>
    );
};

export default ProfilePage;