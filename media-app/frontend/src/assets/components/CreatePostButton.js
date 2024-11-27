import React from 'react';
import { Button } from '@nextui-org/react';

const CreatePostButton = ({ onOpen }) => {
  return (
    <Button color="primary" className="max-w-xs" onClick={onOpen}>
      Create Post
    </Button>
  );
};

export default CreatePostButton;


