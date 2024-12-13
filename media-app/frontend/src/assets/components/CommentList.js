import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { getComments } from '../../handlers/CommentHandler';
import Comment from './Comment';
import API_BASE_URL from '../../config';

const CommentList = forwardRef(({ post_id, token }, ref) => {
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        try {
            const fetchedComments = await getComments(token, post_id);
            setComments(fetchedComments.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: fetchComments,
    }));

    useEffect(() => {
        fetchComments();
    }, [post_id, token]);  // Adding post_id and token to the dependency array

    return (
        <div className='comments-list'>
            {comments.map((comment) => (
                <Comment
                    key={comment.comment_id}
                    username={comment.username}
                    content={comment.content} 
                    createdAt={comment.created_at}
                />
            ))}
        </div>
    );
});

export default CommentList;