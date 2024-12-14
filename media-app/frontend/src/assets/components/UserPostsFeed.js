import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CircularProgress, ScrollShadow } from '@nextui-org/react';
import Post from './Post';
import { fetchUserPosts } from '../../handlers/UserHandler';
import '../CSS/Profile.css';

const UserPostsFeed = forwardRef(({ userId }, ref) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    

    useImperativeHandle(ref, () => ({
        refresh: () => {
            setPage(0);
            fetchUserPosts(0);
        },
    }));

    useEffect(() => {
        fetchUserPosts(userId, page, setPosts, setLoading);
    }, [page]);

    return (
        <div className="profilefeed-container">
            <div className="pagination-controlss-profile">
                <button
                    disabled={page === 0 || loading}
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                >
                    Previous Page
                </button>
                <button
                    disabled={loading}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Next Page
                </button>
            </div>
            <ScrollShadow hideScrollBar>
                <div>
            {loading && <CircularProgress aria-label="Loading user posts..." />}
            {!loading && posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.map((post, index) => <Post key={index} post={post} index={index} />)
            )}
            </div>
            </ScrollShadow>
            
        </div>
    );
});

export default UserPostsFeed;
