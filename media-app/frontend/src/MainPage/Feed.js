import './MainPage.css';
import React, { useEffect, useState, forwardRef, useImperativeHandle  } from 'react';
import { Card, CardBody, CardFooter, CardHeader, CircularProgress} from "@nextui-org/react";
import API_BASE_URL from '../config'; 

const Feed = forwardRef((props, ref) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard`, {
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
                    <Card key={index} className="post-card" style={{ marginVertical: 10 }} shadow='none'>
                        <CardHeader>
                            <p>{post.userid}</p>
                        </CardHeader>
                        <CardBody>
                            <p>{post.content}</p>
                        </CardBody>
                        <CardFooter>
                            <p style={{ color: 'gray' }}>Posted on: {new Date(post.created_at).toLocaleString()}</p>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
    );
});

export default Feed;