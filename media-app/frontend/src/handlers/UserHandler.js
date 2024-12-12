import API_BASE_URL from '../config';
import { showErrorMess } from './SystemNotification';

export const createAcc = async (e,formData, navigate) => {
    e.preventDefault();

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

export const fetchUserProfile = async (setUsername, setTotalPosts, setTotalFollowers, setTotalFollowing, setTotalFriends, setPosts) => {
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
            setPosts(data.posts);
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