import React from 'react';
import { Card, Button, Spacer } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const UserCard = ({ user, setAlertModal, followUser }) => {
    return (
        <Card className='user-card' key={user.user_id} shadow='none'>
            {/* Add Link component to username */}
            <Link to={`/user/${user.user_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <p className='usercard-text'>{user.username}</p>
            </Link>
            <Spacer x={5} />
            <Button
                className='addfriend-button'
                style={{
                    backgroundColor: '#450b00', // Brown color
                    color: 'white', // White text
                }}
                onClick={() => followUser(user.user_id, setAlertModal)} // Call followUser
            >
                Follow
            </Button>
        </Card>
    );
};

export default UserCard;
