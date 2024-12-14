import API_BASE_URL from '../config';

export const sendMessage = async (loggedInUserId, userId, chatboxId, newMessage, setNewMessage, setError, setMessages) => {
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
            fetchMessages(chatboxId, setMessages, setError);  // Refetch messages to reflect the new one sent
        } else {
            const data = await response.json();
            setError(data.error || 'Failed to send message');
        }
    } catch (error) {
        setError('Something went wrong while sending the message');
    }
};

export const chatboxDirect = async (loggedInUserId, userId, username, navigate, setError) => {
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

        if (!response.ok) {
            throw new Error("Failed to create or fetch chatbox");
        }

        const data = await response.json();
        const chatboxId = data.chatbox_id;

        // Navigate to ChatPage with state
        navigate(`/chat/${chatboxId}`, { state: { userId, username } });
    } catch (error) {
        setError('Something went wrong while creating or fetching the chatbox');
        console.error(error);
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

export const fetchMessages = async (chatboxId, setMessages, setError) => {
    const token = localStorage.getItem('token');
    if (!token) {
        setError('Authorization token is missing.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/get-chatbox-messages?chatbox_id=${chatboxId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok && data.messages) {
            setMessages(data.messages);
        } else {
            setError(data.error || 'No messages found');
        }
    } catch (error) {
        setError('Failed to fetch messages');
    }
};