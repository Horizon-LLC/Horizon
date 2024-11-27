
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

const AlertModal = ({ isOpen, text, type, onClose }) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} hideCloseButton>
            <ModalContent>
                <ModalHeader>
                    <h2>{type === 'error' ? 'Error' : 'Success'}</h2>
                </ModalHeader>
                <ModalBody>
                    <p>{text}</p>
                </ModalBody>
                <ModalFooter>
                    <Button auto onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AlertModal;

