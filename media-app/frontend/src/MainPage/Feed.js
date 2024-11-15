import './MainPage.css';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Card, CardBody, CardFooter, CardHeader, CircularProgress } from "@nextui-org/react";
import Post from '../assets/components/Post';
import API_BASE_URL from '../config';

const Feed = forwardRef(({ userId }, ref) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            // If userId is provided, fetch posts for that user; otherwise, fetch for logged-in user
            const url = userId 
                ? `${API_BASE_URL}/profile/${userId}/posts`
                : `${API_BASE_URL}/dashboard`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                console.error('Unauthorized: Please log in to access the posts');
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setPosts(data.posts);
            } else {
                console.error('Failed to fetch posts:', data.error);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: fetchPosts,
    }));

    useEffect(() => {
        fetchPosts();
    }, []);  // Re-fetch posts when userId changes

    return (
        <div className="feed-container">
            {loading && <CircularProgress aria-label="Loading..." />}
            {posts.length === 0 ? (
                <></>
            ) : (
                posts.map((post, index) => (
                    <Post key={index} post={post} index={index} />
                ))
            )}
        </div>
    );
});

export default Feed;
