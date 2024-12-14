import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Comment from './Comment';
import {fetchComments} from '../../handlers/CommentHandler';

const CommentList = forwardRef(({ post_id, token }, ref) => {
    const [comments, setComments] = useState([]);


    useImperativeHandle(ref, () => ({
        refresh: fetchComments(token, post_id, setComments),
    }));

    useEffect(() => {
        fetchComments(token, post_id, setComments);
    }, [post_id, token]);  

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

