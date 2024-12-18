import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { CircularProgress, ScrollShadow } from '@nextui-org/react';
import Post from '../assets/components/Post';
import CreatePostButton from '../assets/components/CreatePostButton';
import CreatePostModal from '../assets/components/PostModal';
import { fetchPosts } from '../handlers/FeedHandler';


const Feed = forwardRef((props, ref) => {
    const [posts, setPosts] = useState([]); // State to hold posts
    const [loading, setLoading] = useState(false); // State to show loading indicator
    const [page, setPage] = useState(0); // State for pagination
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false); // State for post modal visibility


    // Expose the refresh method to the parent component
    useImperativeHandle(ref, () => ({
        refresh: () => {
            console.log('Refreshing feed...'); // Debug log
            setPage(0); // Reset to the first page
            fetchPosts(0, setLoading, setPosts, props); // Fetch posts for the first page
        },
    }));

    // Fetch posts whenever the page changes
    // Reset to page 0 and fetch posts when the mode changes
    useEffect(() => {
        setPage(0);  // Reset the page to 0
        fetchPosts(0, setLoading, setPosts, props); // Fetch posts for the first page
    }, [props.selectedMode]); // Only depends on `props.selectedMode`

    // Fetch posts whenever the page changes
    useEffect(() => {
        fetchPosts(page, setLoading, setPosts, props); // Fetch posts for the current page
    }, [page]); // Independent of `props.selectedMode`

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
            <ScrollShadow hideScrollBar >
                <div>
            {loading && <CircularProgress aria-label="Loading feed..." />} {/* Show loading */}
            {!loading && posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.map((post, index) => <Post key={index} post={post} index={index} />)
            )}
            </div>
            </ScrollShadow>
            {/* Pagination */}
            <div className="pagination-controlss">
                <button
                    disabled={page === 0 || loading} // Disable if on page 0 or loading
                    onClick={() => {
                        if (page > 0) { // Ensure the page is greater than 0
                            setLoading(true); // Show loading
                            setPosts([]); // Clear stale posts
                            setPage((prev) => prev - 1); // Decrement the page
                        }
                    }}
                >
                    Previous
                </button>
                <button
                    disabled={loading} // Disable if loading
                    onClick={() => {
                        setLoading(true); // Show loading
                        setPosts([]); // Clear stale posts
                        setPage((prev) => prev + 1); // Increment the page
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
