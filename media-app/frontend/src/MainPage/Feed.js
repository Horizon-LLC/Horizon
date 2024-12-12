import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { CircularProgress } from "@nextui-org/react";
import Post from '../assets/components/Post';
import API_BASE_URL from '../config';

const Feed = forwardRef((props, ref) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // Page number (starts at 0)

    const fetchPosts = async (page) => {
        setLoading(true);
        const token = localStorage.getItem('token'); 
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard?limit=7&offset=${page * 7}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
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
        refresh: () => {
            setPage(0); // Reset to the first page
            fetchPosts(0); // Fetch posts for the first page
        },
    }));
    

    useEffect(() => {
        fetchPosts(page);
    }, [page]); // Re-fetch posts when the page changes

    return (
        <div className="feed-container">
            {loading && <CircularProgress aria-label="Loading..." />}
            {posts.length === 0 && !loading ? <p>No posts available</p> : (
                posts.map((post, index) => <Post key={index} post={post} index={index} />)
            )}
            <div className="pagination-controlss">
                <button
                    disabled={page === 0}
                    onClick={() => {
                        setPage((prev) => Math.max(prev - 1, 0));
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
                    }}
                >
                    Previous
                </button>
                <button
                    onClick={() => {
                        setPage((prev) => prev + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
});

export default Feed;
