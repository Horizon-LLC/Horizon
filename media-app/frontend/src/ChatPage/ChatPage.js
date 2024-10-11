import './ChatPage.css';
import { IoSendSharp } from "react-icons/io5";
import { Button, Card, ScrollShadow, Input } from '@nextui-org/react';

const ChatPage = ({loggedInUser}) => {
    return(
        <div className='chat-container'>
            <div className='chat-header'>
                <h1 className='username-text'>USER FRIEND</h1>
            </div>
            <div className='chat-content'>
                
            </div>
            <div className='chat-footer'>
                <Input
                    label="Message"
                    radius="lg"
                    className='message-input'
                    placeholder="Message..."
                    endContent={
                    <IoSendSharp className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                />
            </div>

        </div>
    );
};

export default ChatPage;