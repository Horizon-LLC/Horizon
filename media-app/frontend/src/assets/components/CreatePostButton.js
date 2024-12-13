import React from 'react';
import { Button } from '@nextui-org/react';
import { FaPlus } from "react-icons/fa";

const CreatePostButton = ({ onOpen }) => {
  return (
    <Button color="primary" className="create-post-button" onClick={onOpen}>
      <FaPlus />
    </Button>
  );
};

export default CreatePostButton;


