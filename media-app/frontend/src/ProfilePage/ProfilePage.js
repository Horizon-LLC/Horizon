import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, useDisclosure } from '@nextui-org/react';
import FriendsListModal from '../assets/components/FriendsListModal';
import PostModal from '../assets/components/PostModal';
import CreatePostButton from '../assets/components/CreatePostButton';
import UserPagePosts from '../assets/components/UserPagePosts';
import FollowUModal from '../assets/components/FollowUModal';
import { fetchUserProfile } from '../handlers/UserHandler';
import { handleLogout } from '../handlers/UserHandler';
import BioModal from '../assets/components/BioModal';

const ProfilePage = ({ setLoggedInUser, loggedInUserId }) => {
    const [username, setUsername] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const [totalFriends, setTotalFriends] = useState(0);
    const [posts, setPosts] = useState([]);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const feedRefresh = useRef(null);

    const [bio, setBio] = useState('About Me. I love to sleep.'); 
    const [isBioModalOpen, setIsBioModalOpen] = useState(false);
    const [bioInput, setBioInput] = useState(''); 
    const { isPostOpen, onPostOpen, onPostOpenChange } = useDisclosure();
    const { isFollowOpen, onFollowOpen, onFollowOpenChange } = useDisclosure();
    const { isFriendsOpen, onFriendsOpen, onFriendsOpenChange } = useDisclosure();
    
    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });


    // Handle opening the bio modal
    const handleOpenBioModal = () => {
        setBioInput(bio); // Pre-fill the modal with the current bio
        setIsBioModalOpen(true); // Open modal
    };

    // Handle updating the bio
    const handleUpdateBio = () => {
        setBio(bioInput); // Update the bio in state
        setIsBioModalOpen(false); // Close the modal
    };
    
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };



    useEffect(() => {
        fetchUserProfile(setUsername, setTotalPosts, setTotalFollowers, setTotalFollowing, setTotalFriends, setPosts);
    }, [navigate]);

    return (
        <div className="profile-container">
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
                            <Button color="primary" variant="light" className="info-text" onClick={onFriendsOpen} style={{ cursor: 'pointer' }}>
                            {totalFriends} Friends
                            </Button>
                        </div>
                        <div className="bio">{bio}</div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="dropdown-menu">
                        <div className="profile-card1">
                            <button className="logout-button" onClick={() => handleLogout(setLoggedInUser, navigate)}>Log Out</button>
                            <button className="placeholder-button">Change Profile Picture</button>
                            <button className="placeholder-button" onClick={handleOpenBioModal}>
                                Change Bio
                            </button>
                        </div>
                    </div>
                )}

                {/* Posts section */}
                <UserPagePosts posts={posts} totalPosts={totalPosts}/>

                {/* Options section */}
                <div className="options">
                    <CreatePostButton onOpen={onPostOpen} />
                    <Button color="primary" className="max-w-xs" onClick={onFollowOpen}>
                    Message
                    </Button>
                </div>

                <BioModal 
                isBioModalOpen={isBioModalOpen} 
                setIsBioModalOpen={setIsBioModalOpen} 
                handleUpdateBio={handleUpdateBio} 
                bioInput={bioInput}
                setBioInput={setBioInput}
                />
                <FollowUModal 
            isOpen={isFollowOpen} 
            onOpenChange={onFollowOpenChange} 
            loggedInUserId={loggedInUserId} 
             />
            <PostModal 
                isOpen={isPostOpen} 
                onOpenChange={onPostOpenChange} 
                feedRefresh={feedRefresh}
                setAlertModal={setAlertModal}
                />
                <FriendsListModal 
                    isOpen={isFriendsOpen} 
                    onOpenChange={onFriendsOpenChange} 
                />
        </div>
    );
};

export default ProfilePage;