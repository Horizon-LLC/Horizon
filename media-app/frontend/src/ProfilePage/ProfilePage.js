import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import { Button, useDisclosure } from '@nextui-org/react';
import FriendsListModal from '../assets/components/FriendsListModal';
import PostModal from '../assets/components/PostModal';
import CreatePostButton from '../assets/components/CreatePostButton';
import UserPagePosts from '../assets/components/UserPagePosts';
import FollowUModal from '../assets/components/FollowUModal';
import { fetchUserProfile } from '../handlers/UserHandler';
import { handleLogout } from '../handlers/UserHandler';
import { updateBio } from '../handlers/UserHandler';
import BioModal from '../assets/components/BioModal';
import ProfilePictureModal from '../assets/components/ProfilePictureModal';
import UserPostsFeed from '../assets/components/UserPostsFeed';
import CreatePostModal from '../assets/components/PostModal';
import API_BASE_URL from '../config';

const ProfilePage = ({ setLoggedInUser, loggedInUserId }) => {
    const [username, setUsername] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const [totalFriends, setTotalFriends] = useState(0);
    const [posts, setPosts] = useState([]);
    const [profilePic, setProfilePic] = useState(defaultProfilePic);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const feedRefresh = useRef(null);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);


    const [bio, setBio] = useState('');
    const [isBioModalOpen, setIsBioModalOpen] = useState(false);
    const [bioInput, setBioInput] = useState('');
    const { isOpen: isProfilePicOpen, onOpen: onProfilePicOpen, onOpenChange: onProfilePicOpenChange } = useDisclosure();
    const { isPostOpen, onPostOpen, onPostOpenChange } = useDisclosure();
    const { isFollowOpen, onFollowOpen, onFollowOpenChange } = useDisclosure();
    const { isFriendsOpen, onFriendsOpen, onFriendsOpenChange } = useDisclosure();

    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [followingList, setFollowingList] = useState([]);


    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });

    const handleCreatePostModalOpenChange = (isOpen) => {
        setIsCreatePostModalOpen(isOpen);
    };

    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
    const [followersList, setFollowersList] = useState([]);

    const fetchFollowers = async () => {
        console.log("Fetching followers list...");
        try {
            const response = await fetch(`${API_BASE_URL}/profile/followers`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Followers data:", data);

                // Remove duplicates
                const uniqueFollowers = data.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.user_id === value.user_id)
                );

                setFollowersList(uniqueFollowers);
                setIsFollowersModalOpen(true);
            } else {
                console.error("Failed to fetch followers list, status:", response.status);
                const errorText = await response.text();
                console.error("Response text:", errorText);
            }
        } catch (error) {
            console.error("Error fetching followers list:", error);
        }
    };

    
    const fetchFollowing = async () => {
        console.log("Fetching following list...");
        try {
            const response = await fetch(`${API_BASE_URL}/profile/following`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("Response status:", response.status);
    
            if (response.ok) {
                const data = await response.json();
                console.log("Following data:", data);
    
                // Remove duplicates
                const uniqueFollowing = data.following.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.user_id === value.user_id)
                );
    
                setFollowingList(uniqueFollowing);
                setIsFollowingModalOpen(true);
            } else {
                console.error("Failed to fetch following list, status:", response.status);
                const errorText = await response.text();
                console.error("Response text:", errorText);
            }
        } catch (error) {
            console.error("Error fetching following list:", error);
        }
    };
    

    
    
    

    // Fetch the user profile data, including profile picture
    useEffect(() => {
        fetchUserProfile(
            setUsername,
            setTotalPosts,
            setTotalFollowers,
            setTotalFollowing,
            setTotalFriends,
            setPosts,
            setProfilePic,
            setBio // Pass setBio here
        );
    }, [navigate]); // Trigger on navigation changes

    // Handle opening the bio modal
    const handleOpenBioModal = () => {
        setBioInput(bio); // Pre-fill the modal with the current bio
        setIsBioModalOpen(true); // Open modal
    };

    // Handle updating the bio
    const handleUpdateBio = async () => {
        if (bioInput.trim().length === 0) {
            alert("Bio cannot be empty.");
            return;
        }
    
        await updateBio(bioInput, setBio, setAlertModal);
        setIsBioModalOpen(false); // Close the modal
    };
    

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="center-container-profile">
            <div className="profile-head">
                <button className="settings-button" onClick={toggleMenu}>
                        &#9776;
                </button>
                <div className="pfp">
                    <img
                        src={profilePic}
                        alt="Profile"
                        onClick={onProfilePicOpen} // Open profile picture modal
                    />
                </div>
                <div className="info">
                    <span className="username-text">{username}</span>
                    <div className="info-line">
                        <span className="info-text">{totalPosts} Posts</span>
                        <span className="info-text" onClick={fetchFollowers}>
                            {totalFollowers} Followers
                        </span>
                        <span className="info-text" onClick={fetchFollowing}>
                            {totalFollowing} Following
                        </span>
                    </div>
                    <div className="bio">{bio || 'No bio available'}</div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="dropdown-menu">
                    <div className="profile-card1">
                        <button className="logout-button" onClick={() => handleLogout(setLoggedInUser, navigate)}>
                            Log Out
                        </button>
                        <button className="placeholder-button" onClick={onProfilePicOpen}>
                            Change Profile Picture
                        </button>
                        <button className="placeholder-button" onClick={handleOpenBioModal}>
                            Change Bio
                        </button>
                    </div>
                </div>
            )}

            {isFollowersModalOpen && (
                <div
                    className="following-modal-overlay"
                    onClick={() => setIsFollowersModalOpen(false)}
                >
                    <div
                        className="following-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-button"
                            onClick={() => setIsFollowersModalOpen(false)}
                        >
                            ×
                        </button>
                        <h3>Followers</h3>
                        <ul>
                            {followersList.map((user) => (
                                <li key={user.user_id}>{user.username}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {isFollowingModalOpen && (
                <div
                    className="following-modal-overlay"
                    onClick={() => setIsFollowingModalOpen(false)}
                >
                    <div
                        className="following-modal-content following-modal-specific"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-button"
                            onClick={() => setIsFollowingModalOpen(false)}
                        >
                            ×
                        </button>
                        <h3>Following</h3>
                        <ul>
                            {followingList.map((user) => (
                                <li key={user.user_id}>{user.username}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}





            {/* User's Posts Feed */}
            <div className="feed-bottom">
                <UserPostsFeed
                    ref={feedRefresh}
                    userId={loggedInUserId}
                />
            </div>


            <BioModal
                isBioModalOpen={isBioModalOpen}
                setIsBioModalOpen={setIsBioModalOpen}
                handleUpdateBio={handleUpdateBio} 
                bioInput={bioInput}
                setBioInput={setBioInput}
            />
            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onOpenChange={handleCreatePostModalOpenChange}
                refreshFeed={() => feedRefresh.current.refresh()}
            />
            <FollowUModal isOpen={isFollowOpen} onOpenChange={onFollowOpenChange} loggedInUserId={loggedInUserId} />
            <FriendsListModal isOpen={isFriendsOpen} onOpenChange={onFriendsOpenChange} />
            <ProfilePictureModal
                isOpen={isProfilePicOpen}
                onOpenChange={onProfilePicOpenChange}
                setProfilePic={setProfilePic} // Pass the setter to update the profile picture
            />
        </div>
    );
};

export default ProfilePage;
