import React, { useState, useEffect } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import './Friends.css';
import { fetchFriendsList } from '../handlers/FollowHandler';
import { openChatbox } from '../handlers/MessageHandler';

const Friends = () => {
  const navigate = useNavigate();

  const [friendsList, setFriendsList] = useState([]);


    useEffect(() => {
        fetchFriendsList(setFriendsList);
    }, []); 

  return (
    <div className='friendpage-container'>
      <div className="friends-container">
        <ScrollShadow>
          <ul className="friend-list">
            {friendsList.length === 0 ? ( <li>Loading/No friends to display</li>) : (
              friendsList.map(friend => (
                <li key={friend.user_id} className="friend-item">
                  {friend.username}
                  <button
                    className="message-button"
                      onClick={() => {
                    openChatbox(localStorage.getItem('user_id'), friend.user_id, friend.username, navigate);
                    }}
                  >
                    Message
                  </button>
                </li>
                ))
            )}
          </ul>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default Friends;