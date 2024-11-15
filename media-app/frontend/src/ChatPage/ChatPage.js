import './ChatPage.css';
import { useParams, useLocation } from 'react-router-dom';
import { IoSendSharp } from "react-icons/io5";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, ScrollShadow } from '@nextui-org/react';
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API_BASE_URL from '../config';

// Initialize WebSocket client with necessary configurations
const socket = io(API_BASE_URL, { 
    transports: ['websocket'], 
    withCredentials: true 
});

const ChatPage = ({ loggedInUser, loggedInUserId }) => {
    const { chatboxId } = useParams(); 
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const userId = location.state?.userId;
    const username = location.state?.username;

    // Reset the state and refetch messages on load
    const initializeChat = async () => {
        setMessages([]);  // Reset messages
        setNewMessage('');  // Clear the message input
        setError(null);  // Clear errors
        fetchMessages();  // Fetch fresh data from the server
        socket.emit('join_room', { chatbox_id: chatboxId });
    };

    // Fetch messages from the server
    const fetchMessages = async () => {
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

    // Send message to the server
    const sendMessage = async () => {
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

    // Effect to initialize chat and fetch messages on mount or refresh
    useEffect(() => {
        initializeChat();

        // Listen for incoming messages in real-time
        socket.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup on unmount
        return () => {
            socket.off('receive_message');
            socket.disconnect();
        };
    }, [chatboxId, loggedInUserId]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='chat-container'>
            <div className='chat-header'>
                <h1 className='username-text'>{username}</h1>
            </div>

            <div className='chat-content'>
                {error ? (
                    <p>{error}</p>
                ) : (
                    <ul>
                        {messages.slice().reverse().map((message, index) => (
                            <ScrollShadow hideScrollBar key={index}>
                                {message.sender_id === loggedInUserId ? (
                                    <Card className='user-message' shadow='none'>
                                        <CardHeader className='message-header'>
                                            {loggedInUser}
                                        </CardHeader>
                                        <CardBody className='message-content'>
                                            {message.content}
                                        </CardBody>
                                        <CardFooter className='message-footer'>
                                            {new Date(message.time).toLocaleString()}
                                        </CardFooter>
                                    </Card>
                                ) : (
                                    <Card className='otheruser-message' shadow='none'>
                                        <CardHeader className='message-header'>
                                            {username}
                                        </CardHeader>
                                        <CardBody className='message-content'>
                                            {message.content}
                                        </CardBody>
                                        <CardFooter className='message-footer'>
                                            {new Date(message.time).toLocaleString()}
                                        </CardFooter>
                                    </Card>
                                )}
                            </ScrollShadow>
                        ))}
                        <div ref={messagesEndRef} />
                    </ul>
                )}
            </div>

            <div className='chat-footer'>
                <Input
                    label="Message"
                    radius="lg"
                    className='message-input'
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    endContent={
                        <Button
                            auto
                            onClick={sendMessage}
                            className='send-button'
                            disabled={!newMessage.trim()}
                        >
                            <IoSendSharp className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default ChatPage;