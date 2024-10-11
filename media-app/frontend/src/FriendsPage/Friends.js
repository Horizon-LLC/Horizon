import React, { useState } from 'react';
import './Friends.css';

const Friends = () => {
  const [username, setUsername] = useState('');

  const handleAddFriend = () => {
    // Logic to add friend (submit to server)
    console.log('Add friend:', username);
  };

  return (
    <div className="friends-container">
      <h1>Add Friend</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter friend's username"
      />
      <button onClick={handleAddFriend}>Add Friend</button>
    </div>
  );
};

export default Friends;