import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './ProfilePage.css'; 
import API_BASE_URL from '../config'; 

const ProfilePage = ({ setLoggedInUser, setLoggedInUserId }) => {
    const navigate = useNavigate();
    const loggedInUser = setLoggedInUser;
    

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',  // Include session cookies
            });

            if (response.ok) {
                setLoggedInUser(null);
                setLoggedInUserId(null);
                navigate('/Login');
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div class="profile-container">
            <div class="navbar-fill"/>

            <div class="profile-page">
                <div class="profile-head">
                    <div class="pfp">
                        <img src="https://th.bing.com/th/id/R.5ab6f70f26f6ab1e5ef9a4719e79a408?rik=PTqDEnPFmm6k4g&riu=http%3a%2f%2fnickelodeonuniverse.com%2fwp-content%2fuploads%2fdora.png&ehk=paXAjpfixHcFlcNHY2WIGWvpzuJNurqRL6vRXELwbw0%3d&risl=&pid=ImgRaw&r=0" />
                    </div>
                    <div class="info">
                        <div class="info1">
                            <a class="info-text">Username</a>
                            <a class="info-text">Edit Profile</a>
                            <button class="settings-button info-text">Settings</button>
                        </div>
                        <div class="info1">
                            <a class="info-text">#Posts</a>
                            <a class="info-text">#Followers</a>
                            <a class="info-text">#Following</a>
                        </div>
                        <div class="bio">
                            Yo soy Dora.
                        </div>
                    </div>

                </div>
                <div class="posts">
                <div>post</div>
                <div>post</div>
                <div>post</div>
                </div>

                <div id="set" className="profile-header">
                    <h1 className="profile-header-text">Profile Page</h1>
                </div>
                <div className="profile-card1">
                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                    <button className="placeholder-button">Random Button</button>
                    <button className="placeholder-button">More Random Button</button>
                    <button className="placeholder-button">Kill Switch (do not press hahaha) </button>
                </div>
            </div>
        </div>
    );
    
};

export default ProfilePage;
