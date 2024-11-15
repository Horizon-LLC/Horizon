import React from 'react';
import { Card, Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const UserCard = ({ user, followUser }) => {
    return (
        <Card className='user-card' key={user.user_id} shadow='none'>
            <Link to={`/user/${user.user_id}`}>
                <p className='usercard-text'>{user.username}</p>
            </Link>
            <Button
                className='addfriend-button'
                onClick={() => followUser(user.user_id)}
            >
                Follow
            </Button>
        </Card>
    );
};

export default UserCard;
