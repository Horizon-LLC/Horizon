import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import { ScrollShadow, Button, Spacer } from '@nextui-org/react';
import FriendsListModal from '../assets/components/FriendsListModal';
import PostModal from '../assets/components/PostModal';
import CreatePostButton from '../assets/components/CreatePostButton';
import UserPagePosts from '../assets/components/UserPagePosts';
import FollowUModal from '../assets/components/FollowUModal';
import { fetchUserProfile } from '../handlers/UserHandler';
import BioModal from '../assets/components/BioModal';
import OptionModal from '../assets/components/OptionModal';
import { TiMessageTyping } from "react-icons/ti";

const ProfilePage = ({ setLoggedInUser, loggedInUserId }) => {
    const [loading, setLoading] = useState(false);
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
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
    
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

    const handleBioModalToggle = () => {
        setIsBioModalOpen(!isBioModalOpen);
      };

      const handleOptionModalToggle = () => {
        setIsOptionModalOpen(!isOptionModalOpen);
      };

    const handlePostModalToggle = () => {
        setIsPostModalOpen(!isPostModalOpen);
      };
    
    const handleFollowModalToggle = () => {
        setIsFollowModalOpen(!isFollowModalOpen);
    };

    const handleFriendModalToggle = () => {
        setIsFriendModalOpen(!isFriendModalOpen);
    };
    

    useEffect(() => {
        fetchUserProfile(localStorage.getItem("user_id"), setUsername, setTotalPosts, setTotalFollowers, setTotalFollowing, setTotalFriends, setPosts, setLoading);
    }, [navigate]);

    return (
        <div className="profile-container">
                <div className="profile-head">
                    <div className="pfp">
                        <img src={defaultProfilePic} alt="Profile" />
                    </div>
                    <div className="info">
                        <div className='info-top'>
                        <span className="username-text">{username}</span>
                        <button className="settings-button" onClick={handleOptionModalToggle}>
                            &#9776;
                        </button>
                        </div>
                        <div className="info-line">
                            <h1 className="info-text">{totalPosts} Posts</h1>
                            <Spacer x={5} />
                            <h1 className="info-text">{totalFollowers} Followers</h1>
                            <Spacer x={5} />
                            <h1 className="info-text">{totalFollowing} Following</h1>
                            <Spacer x={5} />
                            <Button color="black" variant="light" className="info-text" onClick={handleFriendModalToggle} >
                            {totalFriends} Friends
                            </Button>
                        </div>
                        <div className="bio">{bio}</div>
                    </div>
                </div>

                <Spacer y={8} />


                {/* Posts section */}
                <ScrollShadow hideScrollBar>
                <UserPagePosts posts={posts} totalPosts={totalPosts} loading={loading} />
                </ScrollShadow>

                <Spacer y={8} />

                {/* Options section */}
                <div className="options">
                    <CreatePostButton onOpen={handlePostModalToggle} />
                    <Spacer x={8} />
                    <Button color="primary" className="openmessage-button" onClick={handleFollowModalToggle}>
                    <TiMessageTyping />
                    </Button>
                </div>

                <BioModal 
                isBioModalOpen={isBioModalOpen} 
                onOpenChange={setIsBioModalOpen} 
                handleUpdateBio={handleUpdateBio} 
                bioInput={bioInput}
                setBioInput={setBioInput}
                />
                <OptionModal 
                setLoggedInUser={setLoggedInUser} 
                navigate={navigate} 
                isOpen={isOptionModalOpen} 
                onOpenChange={setIsOptionModalOpen} 
                handleBioModalToggle={handleBioModalToggle}
                />
                <FollowUModal 
                    isOpen={isFollowModalOpen} 
                    onOpenChange={setIsFollowModalOpen} 
                    loggedInUserId={loggedInUserId} 
                />
                <PostModal 
                    isOpen={isPostModalOpen} 
                    onOpenChange={setIsPostModalOpen} 
                    feedRefresh={feedRefresh}
                    setAlertModal={setAlertModal}
                />
                <FriendsListModal 
                    isOpen={isFriendModalOpen} 
                    onOpenChange={setIsFriendModalOpen} 
                />
        </div>
    );
};

export default ProfilePage;