import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Spacer } from '@nextui-org/react';
import '../CSS/Comment.css';



const Comment = ({ username, content, createdAt }) => {
  return (
    <Card className="comment-card" style={{ marginVertical: 10 }} shadow="none">
      <CardHeader >
        <p className='username'>{username}</p>
      </CardHeader>
      <CardBody>
        <p>{content}</p>
      </CardBody>
      <CardFooter>
        <p style={{ color: 'gray' }}>
          Posted on: {new Date(createdAt).toLocaleString()}
        </p>
        <Spacer x={3} />
      </CardFooter>
    </Card>
  );
};

export default Comment;