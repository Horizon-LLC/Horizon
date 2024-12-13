import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';
import API_BASE_URL from '../../config';

const CreatePostModal = ({ isOpen, onOpenChange, refreshFeed }) => {
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB.');
            return;
        }
        if (selectedFile && !selectedFile.type.startsWith('image/')) {
            alert('Only image files are allowed.');
            return;
        }
        setFile(selectedFile);
    };

    const handlePostCreation = async () => {
        const formData = new FormData();
        formData.append('content', content);
        if (file) formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/create-post`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const newPost = await response.json();
                alert('Post created successfully!');
                refreshFeed(newPost); // Pass new post directly to Feed
                onOpenChange(false); // Close the modal
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post. Try again.');
        }
    };

    // Clear content and file when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setContent('');
            setFile(null);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Create a Post</ModalHeader>
                        <ModalBody>
                            <Textarea
                                placeholder="What's on your mind?"
                                fullWidth
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </ModalBody>
                        <ModalFooter>
                            <Button auto flat color="danger" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button auto onClick={handlePostCreation} disabled={!content}>
                                Post
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CreatePostModal;
