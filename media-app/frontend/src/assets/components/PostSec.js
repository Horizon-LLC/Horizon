import React, {useState, useEffect} from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Spacer } from '@nextui-org/react';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { toggleLike, fetchLikeData } from '../../handlers/LikeHandler';
import { useNavigate } from 'react-router-dom';
import '../CSS/Comment.css';


const PostSec = ({ post, index, onModalOpen }) => {
  const [liked, setLiked] = useState(false); // State to track if the post is liked
  const [likeCount, setLikeCount] = useState(0); // State to track total likes
  const navigate = useNavigate();



  useEffect(() => {
    fetchLikeData(post.post_id, setLiked, setLikeCount);
  }, []);

  return (
    <Card key={index} className="selectedpost-card" style={{ marginVertical: 10 }} shadow="none">
      <CardHeader className='post-header'>
        <p>{post.username}</p>
      </CardHeader>
      <CardBody>
        <p>{post.content}</p>
      </CardBody>
      <CardFooter>
        <p style={{ color: 'gray' }}>
          Posted on: {new Date(post.created_at).toLocaleString()}
        </p>

        <Spacer x={3} />

        <Button 
          auto 
          flat 
          style={{
            background: 'transparent',
            boxShadow: 'none',
            padding: 0, 
            minWidth: 'auto', 
          }} 
          onClick={onModalOpen}
        >
          <FaRegCommentDots size={24}/>
        </Button>

        <Spacer x={3} />
        
        <Button 
          auto 
          flat 
          style={{
            background: 'transparent',
            boxShadow: 'none',
            padding: 0, 
            minWidth: 'auto', 
          }} 
          onClick={() => toggleLike(post.post_id, liked, setLiked, setLikeCount)}
        >
          {liked ? <BiSolidLike size={24} /> : <BiLike size={24} />}
        </Button>
        <p style={{ marginLeft: 10 }}>{likeCount} Likes</p>
      </CardFooter>
    </Card>
  );
};

export default PostSec;
