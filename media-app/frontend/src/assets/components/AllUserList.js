import React, { useState, useEffect } from 'react';
import { Card, ScrollShadow } from '@nextui-org/react';
import UserCard from './UserCard';
import { searchUsers, getAllUsers } from '../../handlers/UserHandler';
import { followUser } from '../../handlers/FollowHandler';

const AllUserList = ({ setAlertModal, searchQuery, loggedInUserId }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            getAllUsers(setUsers, setAlertModal); // Fetch all users when search is empty
        } else {
            searchUsers(searchQuery, setUsers, setAlertModal); // Search users
        }
    }, [searchQuery, setAlertModal]);

    // Filter out the logged-in user (only if `loggedInUserId` is defined)
    const filteredUsers = loggedInUserId ? users.filter(user => user.user_id !== loggedInUserId) : users;

    return (
        <Card className='profilelist-container'>
            <ScrollShadow hideScrollBar>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <UserCard 
                            key={user.user_id} 
                            user={user} 
                            setAlertModal={setAlertModal} 
                            followUser={followUser} // Pass followUser
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
