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
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (response.ok) {
            showErrorMess('Friend added successfully', 'success', setAlertModal);
        } else {
            // Show specific error if the friendship already exists
            const errorMessage = data.error || 'Failed to add friend. You already have them followed';
            showErrorMess(errorMessage, 'error', setAlertModal);
        }
    } catch (error) {
        console.error('Error following user: You already have them followed ', error);
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

export const addFriend = async (userId, setError) => {
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
            return;
        } else {
            setError(data.error || 'Failed to send follow request');
        }
    } catch (error) {
        setError('Something went wrong while sending the follow request');
    }
};

export const fetchFollowers = async (setFollowersList, setIsFollowersModalOpen) => {
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

export const fetchFollowing = async (setFollowingList, setIsFollowingModalOpen) => {
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