import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';
import { fetchFriendsList } from "../../handlers/FollowHandler";

const FriendsListModal = ({ isOpen, onOpenChange }) => {
    const [friendsList, setFriendsList] = useState([]);


    useEffect(() => {
        fetchFriendsList(setFriendsList);
    }, []); 
    return(

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader >
                            <h3 className="modal-header">Friends</h3>
                        </ModalHeader>
                        <ModalBody>
                            <ul className="friend-list">
                                {friendsList.length === 0 ? ( <li>Loading/No friends to display</li>) : (
                                    friendsList.map(friend => (
                                        <li key={friend.user_id} className="friend-item">
                                            {friend.username}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </ModalBody>
                        <ModalFooter>
                            <Button auto flat color="danger" onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FriendsListModal;