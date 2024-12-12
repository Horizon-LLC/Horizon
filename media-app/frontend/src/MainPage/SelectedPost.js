import React from 'react';
import { Input } from '@nextui-org/react';
import { CiSearch } from 'react-icons/ci';
import Post from '../assets/components/Post';

const SelectedPost = ({ post, index }) => {
    return (
        <Post post={post} index={index} />
    );
};

export default SelectedPost;
