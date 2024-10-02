import './MainPage.css'
import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardHeader, Input, Spacer, ScrollShadow} from "@nextui-org/react";




const Feed = ({loggedInUser}) => {
    const [posts, setPosts] = useState([]);

    const [userData, setUserData] = useState({
        username: loggedInUser
    });

   

    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                
                const response = await fetch('http://127.0.0.1:5000/dashboard', {
                    method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                }
                );
                if (response.status === 401) {
                    console.error('Unauthorized: Please log in to access the dashboard');
                    return;
                }
                const data = await response.json();
                

                if(response.ok)
                {
                    setPosts(data.posts);
                }
                else{
                    const errorMessage = await response.json();
                    console.error('Failed to fetch posts:', errorMessage.error);
                    return;
                }
        
                
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