import React, { useState } from 'react';
import './Friends.css';

const Friends = () => {
  const [username, setUsername] = useState('');

  const handleAddFriend = () => {
    // Logic to add friend (submit to server)
    console.log('Add friend:', username);
  };

  return (
    <div className='friendpage-container'>
      <div className="friends-container">
        <h1>Add Friend</h1>
        <input
          className='friend-input'
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter friend's username"
        />
        <button  className='addfriend-button' onClick={handleAddFriend}>Add Friend</button>
      </div>
    </div>
  );
};

export default Friends;