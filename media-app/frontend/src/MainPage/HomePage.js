import './MainPage.css';
import React, { useState } from 'react';
import { Button, Card, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Textarea } from '@nextui-org/react';

const HomePage = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [message, setMessage] = useState('');  
    const maxChar = 2000;            
    
    const messageLengthCheck = (e) => {
        if (e.target.value.length <= maxChar) {
            setMessage(e.target.value);
        }
    };

    return (
        <div className='container'>
            <Card className='side-container'>
                <Button color="primary" className="max-w-xs">
                    List
                </Button>
            </Card>
            <Spacer x={5} />
            <Card className='center-container'>
                <Button color="primary" className="max-w-xs" onClick={onOpen}>
                    Create Post
                </Button>
            </Card>
            <Spacer x={5} />
            <Card className='side-container'>
                <Button color="primary" className="max-w-xs">
                    User Page
                </Button>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                <ModalHeader>
                    <h2>Create a New Post</h2>
                </ModalHeader>
                <ModalBody>
                    <Input label="Title" placeholder="Enter the title of your post" fullWidth />
                        <Spacer y={2} />
                        <Textarea 
                        label="Message" 
                        placeholder="Write your message here..." 
                        fullWidth 
                        value={message}
                        onChange={messageLengthCheck}
                        maxLength={maxChar}
                        />
                        <p className='charCountText' >{message.length} / {maxChar} characters</p>
                </ModalBody>
                <ModalFooter>
                    <Button auto flat color="danger" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button auto color='primary' onClick={onClose}>
                        Post
                    </Button>
                </ModalFooter>
            </>
        )}
        </ModalContent>
      </Modal>
        </div>
    );
};

export default HomePage;
