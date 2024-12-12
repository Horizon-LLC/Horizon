import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';


const UserPagePosts = ({posts, totalPosts}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8 // 3x3 grid
    const nextPage = () => setCurrentPage((prev) => prev + 1);
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


    return(
        <div className="posts-grid">
        {posts
            .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
            .map((post, index) => (
                <div key={index} className="post">
                    <div
                        className="post-content"
                    >
                        {post.content}
                    </div>
                    <div className="post-date">
                        {new Date(post.created_at).toLocaleDateString()}&nbsp;
                        {new Date(post.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            ))}
            <div className="pagination-controls">
                <button onClick={prevPage} disabled={currentPage === 1}>
                    ←
                </button>
                <button
                    onClick={nextPage}
                    disabled={(currentPage * postsPerPage) >= totalPosts || posts.length < postsPerPage}
                >
                    →
                </button>
            </div>
        </div> 
    );
};

export default UserPagePosts;