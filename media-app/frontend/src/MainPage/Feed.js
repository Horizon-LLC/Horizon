import './MainPage.css';
import React, { useEffect, useState, forwardRef, useImperativeHandle  } from 'react';
import { Card, CardBody, CardHeader, CircularProgress} from "@nextui-org/react";

const Feed = forwardRef((props, ref) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            const response = await fetch('http://127.0.0.1:5000/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Use the actual token
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                console.error('Unauthorized: Please log in to access the dashboard');
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
        }finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: fetchPosts, 
    }));

    useEffect(() => {
        fetchPosts(); 
    }, []);

    return (
        <div className="feed-container">
            {loading && <CircularProgress aria-label="Loading..." />}
            {posts.length === 0 ? (
                <></>
            ) : (
                posts.map((post, index) => (
                    <Card key={index} className="post-card" style={{ marginVertical: 10 }}>
                        <CardHeader>
                            <p>{post.userid}</p>
                        </CardHeader>
                        <CardBody>
                            <p>{post.content}</p>
                            <p style={{ color: 'gray' }}>Posted on: {new Date(post.created_at).toLocaleString()}</p>
                        </CardBody>
                    </Card>
                ))
            )}
        </div>
    );
});

export default Feed;