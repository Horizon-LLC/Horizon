import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Spacer } from '@nextui-org/react';

const Post = ({ post, index, upvotePost, downvotePost }) => {
  return (
    <Card key={index} className="post-card" style={{ marginVertical: 10 }} shadow="none">
      <CardHeader>
        <p>{post.userid}</p>
      </CardHeader>
      <CardBody>
        <p>{post.content}</p>
      </CardBody>
      <CardFooter>
        <p style={{ color: 'gray' }}>
          Posted on: {new Date(post.created_at).toLocaleString()}
        </p>

        <Spacer x={3} />

        <Button auto flat size="sm" style={{ marginRight: 10 }} aria-label='Upvote'
        onClick={() => upvotePost(index)}>
          Upvote
        </Button>
        <Button auto flat size="sm" aria-label='Downvote'
        onClick={() => downvotePost(index)}>
          Downvote
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
