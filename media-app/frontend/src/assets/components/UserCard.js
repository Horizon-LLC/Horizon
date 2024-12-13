
import React from 'react';
import { Card, Button, Spacer } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { followUser } from '../../handlers/FollowHandler';

const UserCard = ({ user, followUser, setAlertModal }) => {
    return (
        <Card className='user-card' key={user.user_id} shadow='none'>
            <Link to={`/user/${user.user_id}`}>
                <p className='usercard-text'>{user.username}</p>
            </Link>
            <Spacer x={5} />
            <Button
                className='addfriend-button'
                style={{
                    backgroundColor: '#450b00',
                    color: 'white',
                }}
                onClick={() => followUser(user.user_id, setAlertModal)}
            >
                Follow
            </Button>
        </Card>
    );
};

export default UserCard;
