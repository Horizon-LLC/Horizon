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