import React from 'react';
import { Button } from '@nextui-org/react';

const CreatePostButton = ({ onOpen }) => {
    return (
        <Button
            style={{
                backgroundColor: '#450b00',
                color: 'white',
                fontWeight: 'bold',
            }}
            className="max-w-xs"
            onClick={onOpen}
        >
            Create Post
        </Button>
    );
};

export default CreatePostButton;
