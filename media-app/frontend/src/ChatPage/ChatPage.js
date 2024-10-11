import './ChatPage.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { IoSendSharp } from "react-icons/io5";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, ScrollShadow } from '@nextui-org/react';
import React, { useState, useEffect, useRef } from 'react';

const ChatPage = ({loggedInUser, loggedInUserId}) => {

    const { chatboxId } = useParams(); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef(null);
    const userId = location.state?.userId;
    const username = location.state?.username;


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:5000/get-chatbox-messages?chatbox_id=${chatboxId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setMessages(data.messages);
            } else {
                setError(data.error || 'Unauthorized access');
                // Redirect to unauthorized page or handle error
                navigate('/unauthorized');
            }
        } catch (error) {
            setError('Failed to fetch messages');
        }
    };

    const sendMessage = async () => {
        
        if (newMessage.trim() === '') return; // Prevent empty messages

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5000/send-message', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: loggedInUserId, // The ID of the logged-in user
                    receiver_id: userId, // You need to pass the correct receiver_id
                    chatbox_id: chatboxId,
                    content: newMessage,
                }),
            });

            if (response.ok) {
                setNewMessage(''); // Clear the input after sending
                fetchMessages(); // Refresh the messages after sending
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to send message');
            }
        } catch (error) {
            setError('Something went wrong while sending the message');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [chatboxId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return(
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
                                            {message.time}
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
                                            {message.time}
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
                    onChange={(e) => setNewMessage(e.target.value)} // Track the input value
                    endContent={
                        <Button
                            auto
                            onClick={sendMessage}
                            className='send-button'
                            disabled={!newMessage.trim()} // Disable if input is empty
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