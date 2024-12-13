import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import API_BASE_URL from '../config';

const UserProfile = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState({
        username: '',
        bio: '',
        profilePic: defaultProfilePic,
        totalPosts: 0,
        totalFollowers: 0,
        totalFollowing: 0,
    });
    const [error, setError] = useState(null);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                const validProfilePicPrefix = "https://horizon-profile-pictures-bucket.s3.amazonaws.com/";
                const isValidProfilePic = data.profile_pic && data.profile_pic.startsWith(validProfilePicPrefix);
    
                setProfile({
                    username: data.username,
                    bio: data.bio || 'No bio available',
                    profilePic: isValidProfilePic ? data.profile_pic : defaultProfilePic,
                    totalPosts: data.total_posts,
                    totalFollowers: data.total_followers,
                    totalFollowing: data.total_following,
                });
            } else {
                setError(data.error || 'Failed to load profile');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
    };
    

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="center-container-profile">
            <div className="profile-head">
                <div className="pfp">
                    <img src={profile.profilePic} alt={`${profile.username}'s profile`} />
                </div>
                <div className="info">
                    <span className="username-text">{profile.username}</span>
                    <div className="info-line">
                        <span className="info-text">{profile.totalPosts} Posts</span>
                        <span className="info-text">{profile.totalFollowers} Followers</span>
                        <span className="info-text">{profile.totalFollowing} Following</span>
                    </div>
                    <div className="bio">{profile.bio}</div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
