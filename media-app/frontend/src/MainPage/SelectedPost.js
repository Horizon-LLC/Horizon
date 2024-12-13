import './PostPage.css';
import React, {  useRef, useState } from 'react';
import { ScrollShadow, useDisclosure } from '@nextui-org/react';
import { Spacer } from '@nextui-org/react';
import { useLocation } from 'react-router-dom';
import PostSec from '../assets/components/PostSec';
import CommentModal from '../assets/components/CommentModal';
import CommentList from '../assets/components/CommentList';


const SelectedPost = ({ loggedInUser, loggedInUserId }) => {
  const location = useLocation();
  const post = location.state?.post;
  const index = location.state?.index;
  const post_id = post.post_id;
  const commentRefresh = useRef(null);  


  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };



  return (
    <div className='postpage-container'>
      <PostSec post={post} index={index} onModalOpen={handleModalToggle} />

      <Spacer y={5} />

      <ScrollShadow hideScrollBar>
      <div className='comments-section'>
        <CommentList post_id={post_id} token={token} ref={commentRefresh} />
      </div>
      </ScrollShadow>

      <CommentModal
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}  
        commentRefresh={commentRefresh}
        post_id={post_id}
      />
    </div>
  );
};

export default SelectedPost;
