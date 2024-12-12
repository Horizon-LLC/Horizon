import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';


const BioModal = ({isBioModalOpen, setIsBioModalOpen, handleUpdateBio, bioInput, setBioInput}) => {
    return(
        <Modal isOpen={isBioModalOpen} onOpenChange={() => setIsBioModalOpen(false)} hideCloseButton={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h2>Update Bio</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Textarea
                                label="New Bio"
                                placeholder="Enter your new bio (max 150 characters)..."
                                fullWidth
                                value={bioInput}
                                onChange={(e) => setBioInput(e.target.value)}
                                maxLength={150}
                            />
                            <p className="charCountText">{bioInput.length} / 150 characters</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button auto flat color="danger" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button auto color="primary" onClick={handleUpdateBio}>
                                Update
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default BioModal;