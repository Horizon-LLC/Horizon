import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';
import { openChatbox } from '../../handlers/MessageHandler';
import { fetchCombinedFollowList } from '../../handlers/FollowHandler';

const FollowUModal = ({isOpen, onOpenChange, loggedInUserId }) => {
    const [combinedFollowList, setCombinedFollowList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCombinedFollowList(setCombinedFollowList);
    }, []);  

    return(

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader >
                        <h3 className="modal-header">Followers & Following</h3>
                        </ModalHeader>
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
                                        onClick={() => openChatbox(loggedInUserId, user.user_id, user.username, navigate)}
                                    >
                                        Message
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                        </ModalBody>
                        <ModalFooter>
                            <button
                            className="modal-close-button"
                            onClick={() => onClose}
                        >
                            Close
                        </button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FollowUModal;