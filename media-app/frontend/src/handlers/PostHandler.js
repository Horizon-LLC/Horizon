import API_BASE_URL from '../config';
import { showErrorMess } from './SystemNotification';

export const messageLengthCheck = (e, maxChar, setMessage) => {
    if (e.target.value.length <= maxChar) {
        setMessage(e.target.value);
    }
};

const formatDate = (date) => {
    return new Date(date).toISOString(); 
};

export const createPost = async (message, setMessage, feedRefresh, setAlertModal) => {
    if (!message) {
        showErrorMess('Post content cannot be empty', 'error', setAlertModal);
        return;
    }
    const token = localStorage.getItem('token'); 

    try {
        const currentDateTime = formatDate(new Date());
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
            feedRefresh.current.refresh();
        } else {
            showErrorMess(data.error || 'Failed to create post', 'error', setAlertModal);
        }
    } catch (error) {
        console.error('Error creating post:', error);
        showErrorMess('Something went wrong while creating the post', 'error', setAlertModal);
    }
};