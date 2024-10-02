import './MainPage.css'
import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardHeader, Input, Spacer, ScrollShadow} from "@nextui-org/react";




const Feed = () => {
    const [posts, setPosts] = useState([]);
    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/dashboard');
        
                if (!response.ok) {
                    const errorMessage = await response.json();
                    console.error('Failed to fetch posts:', errorMessage.error);
                    return;
                }
        
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="feed-container">
            <h3>Your Posts:</h3>
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.map((post, index) => (
                    <Card key={index} className="post-card" style={{ marginVertical: 10 }}>
                        <CardHeader>
                            <p>{post.userid}</p>
                        </CardHeader>
                        <CardBody>
                            <p>{post.content}</p>
                            <p small style={{ color: 'gray' }}>Posted on: {new Date(post.created_at).toLocaleString()}</p>
                        </CardBody>
                    </Card>
                ))
            )}
        </div>
    )
};

export default Feed;