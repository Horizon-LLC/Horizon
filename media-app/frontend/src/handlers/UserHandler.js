import API_BASE_URL from '../config';
import { showErrorMess } from './SystemNotification';
import defaultProfilePic from '../images/defaultprofilepicture.jpg';


export const createAcc = async (e,formData, navigate) => {
    e.preventDefault();
    console.log("Form submitted:", formData); // Debug log

    try {
        const response = await fetch(`${API_BASE_URL}/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            navigate('/Login');
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export const signIn = async (loginData, setLoggedInUser, setLoggedInUserId, navigate, e) => {
    e.preventDefault();

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token); // Store the JWT token
            localStorage.setItem('username', result.username);
            localStorage.setItem('user_id', result.user_id);
            setLoggedInUser(result.username);
            setLoggedInUserId(result.user_id);
            navigate('/Home');
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert("There was an error connecting to the server. Please try again.");
    }
};

export const getAllUsers = async (setUsers, setAlertModal) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            setUsers(data);
        } else {
            showErrorMess(data.error || 'Failed to get users', 'error', setAlertModal);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        showErrorMess('Something went wrong while getting users', 'error', setAlertModal);
    }
};

export const fetchUserProfile = async (
    setUsername,
    setTotalPosts,
    setTotalFollowers,
    setTotalFollowing,
    setTotalFriends,
    setPosts,
    setProfilePic,
    setBio // Add setBio to update the bio state
) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched bio:', data.bio); // Log the fetched bio
            setUsername(data.username);
            setTotalPosts(data.total_posts);
            setTotalFollowers(data.total_followers);
            setTotalFollowing(data.total_following);
            setTotalFriends(data.total_friends);
            setPosts(data.posts || []);
            setProfilePic(data.profile_pic || defaultProfilePic); 
            setBio(data.bio || ''); // Set bio with fetched data
        } else {
            console.error('Failed to fetch profile:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};




export const handleLogout = async (setLoggedInUser, navigate) => {
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


export const updateBio = async (newBio, setBio, setAlertModal) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    try {
        const response = await fetch(`${API_BASE_URL}/updateBio`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bio: newBio }),  // Only send the new bio
        });

        const data = await response.json();
        if (response.ok) {
            setBio(newBio); // Update the bio in the frontend state
            setAlertModal({ isOpen: true, text: 'Bio updated successfully!', type: 'success' });
        } else {
            setAlertModal({ isOpen: true, text: data.error || 'Failed to update bio', type: 'error' });
        }
    } catch (error) {
        console.error('Error updating bio:', error);
        setAlertModal({ isOpen: true, text: 'Error connecting to server. Try again later.', type: 'error' });
    }
};

export const searchUsers = async (query, setUsers, setAlertModal) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/searchUsers?q=${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            setUsers(data); // Update users based on search results
        } else {
            showErrorMess(data.error || 'Failed to search users', 'error', setAlertModal);
        }
    } catch (error) {
        console.error('Error searching users:', error);
        showErrorMess('Something went wrong while searching users', 'error', setAlertModal);
    }
};


export const fetchUserData = async (userId, setError, setUsername, setBio, setProfilePic, setTotalPosts, setTotalFollowers, setTotalFollowing) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            setUsername(data.username);
            setBio(data.bio || 'No bio available');
            setProfilePic(data.profile_pic || defaultProfilePic);
            setTotalPosts(data.total_posts);
            setTotalFollowers(data.total_followers);
            setTotalFollowing(data.total_following);
        } else {
            setError(data.error || 'Failed to fetch user data');
        }
    } catch (error) {
        setError('Something went wrong while fetching user data');
    }
};

export const fetchUserPosts = async (userId, page, setPosts, setLoading) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${API_BASE_URL}/dashboard/user-posts?limit=7&offset=${page * 7}&user_id=${userId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await response.json();
        if (response.ok) {
            setPosts(data.posts);
        } else {
            console.error('Failed to fetch user posts:', data.error);
        }
    } catch (error) {
        console.error('Error fetching user posts:', error);
    } finally {
        setLoading(false);
    }
};