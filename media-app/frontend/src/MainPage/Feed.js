import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { CircularProgress } from '@nextui-org/react';
import Post from '../assets/components/Post';
import CreatePostButton from '../assets/components/CreatePostButton';
import CreatePostModal from '../assets/components/PostModal';
import API_BASE_URL from '../config';

const Feed = forwardRef((props, ref) => {
    const [posts, setPosts] = useState([]); // State to hold posts
    const [loading, setLoading] = useState(false); // State to show loading indicator
    const [page, setPage] = useState(0); // State for pagination
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false); // State for post modal visibility

    // Fetch posts from the backend
    const fetchPosts = async (page) => {
        console.log('Fetching posts for page:', page, 'Mode:', props.selectedMode); // Debug log
        setLoading(true); // Start loading
        setPosts([]); // Clear stale posts
    
        const token = localStorage.getItem('token');
        const endpoint = props.selectedMode === 'following' ? '/dashboard/following' : '/dashboard';
    
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}?limit=7&offset=${page * 7}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Posts fetched:', data.posts); // Debug log
                setPosts(data.posts);
            } else {
                console.error('Failed to fetch posts:', data.error);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Expose the refresh method to the parent component
    useImperativeHandle(ref, () => ({
        refresh: () => {
            console.log('Refreshing feed...'); // Debug log
            setPage(0); // Reset to the first page
            fetchPosts(0); // Fetch posts for the first page
        },
    }));

    // Fetch posts whenever the page changes
    useEffect(() => {
        // Reset to page 0 and fetch posts when mode changes or page changes
        setPage(0);  // Reset the page to 0
        setLoading(true);
        fetchPosts(0); // Fetch posts for the first page
    }, [page, props.selectedMode]); // Add `props.selectedMode` as a dependency

    // Handlers for the Create Post modal
    const handleCreatePostOpen = () => {
        setIsCreatePostModalOpen(true);
    };

    const handleCreatePostClose = () => {
        setIsCreatePostModalOpen(false);
    };

    const addNewPost = (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };
    
    <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onOpenChange={handleCreatePostClose}
        refreshFeed={addNewPost}
    />
    

    return (
        <div className="feed-container">
            {loading && <CircularProgress aria-label="Loading feed..." />} {/* Show loading */}
            {!loading && posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.map((post, index) => <Post key={index} post={post} index={index} />)
            )}

            {/* Pagination */}
            <div className="pagination-controlss">
                <button
                    disabled={page === 0 || loading}
                    onClick={() => {
                        setPage((prev) => Math.max(prev - 1, 0));
                        fetchPosts(page - 1); // Fetch posts for the previous page
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
                    }}
                >
                    Previous
                </button>
                <button
                    disabled={loading}
                    onClick={() => {
                        setPage((prev) => prev + 1);
                        fetchPosts(page + 1); // Fetch posts for the next page
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
                    }}
                >
                    Next 
                </button>
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onOpenChange={handleCreatePostClose}
                refreshFeed={() => ref?.current?.refresh?.()} // Ensure refreshFeed calls the correct function
            />
        </div>
    );
});

export default Feed;
