import React, {useState, useEffect, useCallback} from 'react';
import { Card, ScrollShadow } from '@nextui-org/react';
import UserCard from './UserCard';
import { followUser } from '../../handlers/FollowHandler';
import { getAllUsers } from '../../handlers/UserHandler';

const AllUserList = (setAlertModal) => {
    const [users, setUsers] = useState([]);    

    useEffect(() => {
        getAllUsers(setUsers, setAlertModal); 
    }, [setAlertModal]);

    return (
        <Card className='profilelist-container'>
            <ScrollShadow hideScrollBar>
                {users.length > 0 ? (
                    users.map((user) => (
                        <UserCard 
                            key={user.user_id} 
                            user={user} 
                            setAlertModal={setAlertModal}
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

