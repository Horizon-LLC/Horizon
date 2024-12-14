import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Spacer, Modal, Input } from '@nextui-org/react';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { fetchLikeData, toggleLike } from '../../handlers/LikeHandler';
import API_BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';


const Post = ({ post, index }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchLikeData(post.post_id, setLiked, setLikeCount);
  }, [post.post_id]);



  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/create-comment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.post_id, content: newComment.trim() }),
      });
      if (response.ok) {
        setNewComment('');
      } else console.error('Failed to add comment:', await response.text());
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <>
      <Card key={index} className="post-card" style={{ marginVertical: 10 }} shadow="none">
        <CardHeader>
          <p className="username">{post.username}</p>
        </CardHeader>
        <CardBody>
          {post.content && <p className="post-content">{post.content}</p>}
          {post.pic_link && (
            <img
              src={imageError ? '/images/placeholder-image.jpg' : post.pic_link}
              alt="Attached media"
              className="post-card-img"
              onError={() => setImageError(true)}
            />
          )}
        </CardBody>
        <CardFooter>
          <p className="posted-on">{new Date(post.created_at).toLocaleString()}</p>
          <Spacer x={3} />
          <Button auto flat style={{ background: 'transparent', boxShadow: 'none' }} onClick={() => navigate(`/post/${post.post_id}`, { state: { post: post, index: index } })}>
            <FaRegCommentDots size={24} />
          </Button>
          <Spacer x={3} />
          <Button auto flat style={{ background: 'transparent', boxShadow: 'none' }} onClick={() => toggleLike(post.post_id, liked, setLiked, setLikeCount)}>
            {liked ? <BiSolidLike size={24} /> : <BiLike size={24} />}
          </Button>
          <p style={{ marginLeft: 10 }}>{likeCount} Likes</p>
        </CardFooter>
      </Card>
    </>
  );
};

export default Post;
