import React from 'react';
import { Card, Button, ScrollShadow } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import UserCard from './UserCard';

const AllUserList = ({ users, followUser }) => {
    return (
        <Card className='profile-container'>
            <ScrollShadow hideScrollBar>
                {users.length > 0 ? (
                    users.map((user) => (
                        <UserCard 
                            key={user.user_id} 
                            user={user} 
                            followUser={followUser} 
                        />
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </ScrollShadow>
        </Card>
    );
};

export default AllUserList;
