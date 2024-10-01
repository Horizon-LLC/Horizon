import React from 'react';
import { useNavigate } from 'react-router-dom';  
import './ProfilePage.css'; 

const ProfilePage = ({ setLoggedInUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/logout', {
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

    return (
        <div className="container">
            <div className="profile-header">
                <h1 className="profile-header-text">Profile Page</h1>
            </div>
            <div className="profile-card">
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
                <button className="placeholder-button">Random Button</button>
                <button className="placeholder-button">More Random Button</button>
                <button className="placeholder-button">Kill Switch (do not press hahaha) </button>
            </div>
        </div>
    );
};

export default ProfilePage;
