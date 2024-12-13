import React, {useState, useEffect} from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Spacer } from '@nextui-org/react';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { createLike, getTotalLikes, deleteLike, isLiked, toggleLike, fetchLikeData } from '../../handlers/LikeHandler';
import SelectedPost from '../../MainPage/SelectedPost';
import { useNavigate } from 'react-router-dom';


const Post = ({ post, index }) => {
  const [liked, setLiked] = useState(false); // State to track if the post is liked
  const [likeCount, setLikeCount] = useState(0); // State to track total likes
  const [imageError, setImageError] = useState(false); // State to track image loading error
  const navigate = useNavigate();



  useEffect(() => {
    fetchLikeData(post.post_id, setLiked, setLikeCount);
  }, []);

  return (
    <Card key={index} className="post-card" style={{ marginVertical: 10 }} shadow="none">
      <CardHeader>
        <p>{post.username}</p>
      </CardHeader>
      <CardBody>
        {post.content && <p>{post.content}</p>}
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
          onClick={() => navigate(<SelectedPost post={post} index={index} />)}
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
            padding: 0, // Removes padding for the button to show only the icon
            minWidth: 'auto', // Prevents the button from taking up space
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

export default Post;
