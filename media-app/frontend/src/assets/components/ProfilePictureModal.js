import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { uploadProfilePicture } from '../../handlers/MediaHandler'; // Import the handler

const ProfilePictureModal = ({ isOpen, onOpenChange, setProfilePic }) => {
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        try {
            const profilePicUrl = await uploadProfilePicture(file); // Call the handler function
            setProfilePic(profilePicUrl); // Update the parent component's profile picture
            onOpenChange(false); // Close the modal
        } catch (error) {
            alert(error.message || 'An error occurred while uploading.');
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h3>Change Profile Picture</h3>
                        </ModalHeader>
                        <ModalBody>
                            <input type="file" accept="image/*" onChange={handleUpload} />
                        </ModalBody>
                        <ModalFooter>
                            <Button auto flat color="danger" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ProfilePictureModal;
