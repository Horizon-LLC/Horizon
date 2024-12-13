import { handleLogout } from '../../handlers/UserHandler';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

const OptionModal = ({setLoggedInUser, navigate, isOpen, onOpenChange, handleBioModalToggle}) => {
    return(
        <Modal className='dropdown-menu' isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
            <ModalContent>
                <ModalBody className='profile-card1'>
                    <button className="logout-button" onClick={() => {
                        handleLogout(setLoggedInUser, navigate); 
                        onOpenChange(false);
                    }}>
                        Log Out
                    </button>
                    <button className="placeholder-button">Change Profile Picture</button>
                    <button className="placeholder-button" onClick={() => {
                        handleBioModalToggle();
                        onOpenChange(false);
                    }}>
                        Change Bio
                    </button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default OptionModal;