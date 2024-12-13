import React, { useState, useEffect } from 'react';
import Post from './Post';
import { ScrollShadow } from '@nextui-org/react';
import {CircularProgress } from "@nextui-org/react";


const UserPagePosts = ({posts, totalPosts, loading}) => {
    


    return(
        <div className="profile-posts">
        {loading && <CircularProgress aria-label="Loading..." />}
            {posts.length === 0 ? (
                <></>
            ) : (
                posts.map((post, index) => (
                    <Post post={post} index={index} styleClass={"profile-post"}/>
                ))
            )}
        </div> 
    );
};

export default UserPagePosts;