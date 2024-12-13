import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, ScrollShadow } from '@nextui-org/react';
import { openChatbox } from '../../handlers/MessageHandler';
import { fetchCombinedFollowList } from '../../handlers/FollowHandler';

const FollowUModal = ({isOpen, onOpenChange, loggedInUserId }) => {
    const [combinedFollowList, setCombinedFollowList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCombinedFollowList(setCombinedFollowList);
    }, []);  

    return(

        <Modal className='profile-modal' isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                        <ModalHeader >
                        <h3 className="modal-header">Followers & Following</h3>
                        </ModalHeader>
                        <ScrollShadow>
                        <ModalBody>
                            
                                <ul className="friend-list">
                                {combinedFollowList.length === 0 ? (
                                    <li>No followers or following to display</li>
                                ) : (
                                    combinedFollowList.map(user => (
                                        <li key={user.user_id} className="friend-item">
                                            {user.username}
                                            <button
                                                className="message-button"
                                                onClick={() => {
                                                    openChatbox(loggedInUserId, user.user_id, user.username, navigate);
                                                    onOpenChange(false);
                                                }}
                                            >
                                                Message
                                            </button>
                                        </li>
                                    ))
                                )}
                                </ul>
                        </ModalBody>
                        </ScrollShadow>
                        <ModalFooter>
                            <button
                            className="modal-close-button"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </button>
                        </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FollowUModal;