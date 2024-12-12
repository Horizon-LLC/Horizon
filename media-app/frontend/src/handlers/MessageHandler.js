import API_BASE_URL from '../config';

export const sendMessage = async (loggedInUserId, userId, chatboxId, newMessage, setNewMessage, fetchMessages, setError) => {
    if (newMessage.trim() === '') return;
    const token = localStorage.getItem('token');
    if (!token) {
        setError('Authorization token is missing.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/send-message`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender_id: loggedInUserId,
                receiver_id: userId,
                chatbox_id: chatboxId,
                content: newMessage,
            }),
        });

        if (response.ok) {
            setNewMessage('');
            fetchMessages();  // Refetch messages to reflect the new one sent
        } else {
            const data = await response.json();
            setError(data.error || 'Failed to send message');
        }
    } catch (error) {
        setError('Something went wrong while sending the message');
    }
};

export const openChatbox = async (loggedInUserId, userId, username, navigate) => {
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