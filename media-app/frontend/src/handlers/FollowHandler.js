import API_BASE_URL from '../config';
import { showErrorMess } from './SystemNotification';

export const followUser = async (userId, setAlertModal) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/add-friend`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });

        const data = await response.json();
        if (response.ok) {
            showErrorMess('Friend added successfully', 'success', setAlertModal);
        } else {
            showErrorMess(data.error || 'Failed to add friend', 'error', setAlertModal);
        }
    } catch (error) {
        console.error('Error following user:', error);
        showErrorMess('Something went wrong while following the user', 'error', setAlertModal);
    }
};



export const fetchFriendsList = async (setFriendsList) => {
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

export const fetchCombinedFollowList = async (setCombinedFollowList) => {
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
