import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';
import API_BASE_URL from '../config';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, useDisclosure } from '@nextui-org/react';

const ProfilePage = ({ setLoggedInUser, loggedInUserId }) => {
    const [username, setUsername] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const [totalFriends, setTotalFriends] = useState(0);
    const [combinedFollowList, setCombinedFollowList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const maxChar = 10000;
    const feedRefresh = useRef(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
    
            if (response.ok) {
                setLoggedInUser(null);              // Clear logged-in user state
                localStorage.removeItem('token');    // Remove token from local storage
                localStorage.removeItem('username');
                localStorage.removeItem('user_id');
                navigate('/Login');                  // Redirect to login page
            } else {
                console.error('Logout failed:', response.statusText || 'Unknown error');
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            alert('An error occurred while logging out.');
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
                setTotalFriends(data.total_friends);
            } else {
                console.error('Failed to fetch profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchUserPosts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/profile/posts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            } else {
                console.error('Failed to fetch posts:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchCombinedFollowList = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/profile/followers-following`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCombinedFollowList(data);
            } else {
                console.error('Failed to fetch follow list:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching follow list:', error);
        }
    };

    const fetchFriendsList = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/profile/friends`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFriendsList(data);
            } else {
                console.error('Failed to fetch friends list:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching friends list:', error);
        }
    };

    const openFollowModal = () => {
        fetchCombinedFollowList();
        setIsFollowModalOpen(true);
    };

    const openFriendsModal = () => {
        fetchFriendsList();
        setIsFriendsModalOpen(true);
    };

    const openChatbox = async (userId, username) => {
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

            const data = await response.json();
            if (response.ok) {
                navigate(`/chat/${data.chatbox_id}`, { state: { userId, username } });
            } else {
                console.error(data.error || 'Failed to create/fetch chatbox');
            }
        } catch (error) {
            console.error('Something went wrong while creating or fetching the chatbox');
        }
    };

    const createPost = async () => {
        if (!message) {
            alert('Post content cannot be empty');
            return;
        }
        const token = localStorage.getItem('token');

        try {
            const currentDateTime = new Date().toISOString();
            const response = await fetch(`${API_BASE_URL}/create-post`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: message, created_at: currentDateTime }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('');
                fetchUserPosts();
            } else {
                alert(data.error || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Something went wrong while creating the post');
        }
    };

    const messageLengthCheck = (e) => {
        if (e.target.value.length <= maxChar) {
            setMessage(e.target.value);
        }
    };

    useEffect(() => {
        fetchUserProfile();
        fetchUserPosts();
    }, [navigate]);

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
                            <span className="info-text" onClick={openFriendsModal} style={{ cursor: 'pointer' }}>
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

                {/* Posts section */}
                <div className="posts" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                    {posts.length === 0 ? (
                        <p>No posts yet</p>
                    ) : (
                        posts.map((post, index) => (
                            <div key={index} className="post">
                                <p>{post.content}</p>
                                <p style={{ color: 'gray', fontSize: 'small' }}>
                                    {new Date(post.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Options section */}
                <div className="options">
                    <button className="option-button" onClick={onOpen}>+ Create Post</button>
                    <button className="option-button" onClick={openFollowModal}>Message</button>
                </div>

                {/* Create Post Modal */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <h2>Create a New Post</h2>
                                </ModalHeader>
                                <ModalBody>
                                    <Textarea 
                                        label="Message"
                                        placeholder="Write your message here..." 
                                        fullWidth 
                                        value={message}
                                        onChange={messageLengthCheck}
                                        maxLength={maxChar}
                                    />
                                    <p className='charCountText'>{message.length} / {maxChar} characters</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button auto flat color="danger" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button auto color='primary' onClick={() => {
                                        createPost();
                                        onClose();
                                    }}>
                                        Post
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                {/* Followers/Following Modal */}
                {isFollowModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3 className="modal-header">Followers & Following</h3>
                            <ul className="friend-list">
                                {combinedFollowList.length === 0 ? (
                                    <li>No followers or following to display</li>
                                ) : (
                                    combinedFollowList.map(user => (
                                        <li key={user.user_id} className="friend-item">
                                            {user.username}
                                            <button
                                                className="message-button"
                                                onClick={() => openChatbox(user.user_id, user.username)}
                                            >
                                                Message
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                            <button
                                className="modal-close-button"
                                onClick={() => setIsFollowModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Friends List Modal */}
                {isFriendsModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3 className="modal-header">Friends</h3>
                            <ul className="friend-list">
                                {friendsList.length === 0 ? (
                                    <li>Loading/No friends to display</li>
                                ) : (
                                    friendsList.map(friend => (
                                        <li key={friend.user_id} className="friend-item">
                                            {friend.username}
                                        </li>
                                    ))
                                )}
                            </ul>
                            <button
                                className="modal-close-button"
                                onClick={() => setIsFriendsModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
