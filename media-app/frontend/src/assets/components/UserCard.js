
import React, {useState} from 'react';
import { Card, Button, Spacer } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { followUser } from '../../handlers/FollowHandler';
import AlertModal from './AlertModal';

const UserCard = ({ user }) => {
    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });

    return (
        <div>
        <Card className='user-card' key={user.user_id} shadow='none'>
            <Link to={`/user/${user.user_id}`}>
                <p className='usercard-text'>{user.username}</p>
            </Link>
            <Spacer x={5} />
            <Button
                className='addfriend-button'
                onClick={() => followUser(user.user_id, setAlertModal)}
            >
                Follow
            </Button>
        </Card>

        <AlertModal 
        isOpen={alertModal.isOpen} 
        text={alertModal.text} 
        type={alertModal.type} 
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        />
        </div>
    );
};

export default UserCard;

