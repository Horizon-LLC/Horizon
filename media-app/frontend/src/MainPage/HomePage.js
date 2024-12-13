import './MainPage.css';
import React, { useState, useRef } from 'react';
import { ScrollShadow, Spacer, useDisclosure } from '@nextui-org/react';
import { CiSearch } from "react-icons/ci";
import Feed from './Feed';
import PostModal from '../assets/components/PostModal';
import AlertModal from '../assets/components/AlertModal';
import SearchBar from '../assets/components/SearchBar';
import AllUserList from '../assets/components/AllUserList';
import CreatePostButton from '../assets/components/CreatePostButton';
import CreateRadioButton from '../assets/components/CreateRadioButton';

const HomePage = ({ loggedInUser, setLoggedInUser, setLoggedInUserId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });
    const feedRefresh = useRef(null);   

    // Define state for feed mode
    const [feedMode, setFeedMode] = useState('explore'); 
    const [loading, setLoading] = useState(false); // Loading stat
    

    return (
        <div className='home-container' >
            <div className='center-container'>
            <div className="feed-top">
                <div className="feed-type-container">
                    <span className="feed-type-label">Feed Type:</span>
                    <CreateRadioButton
                            selectedMode={feedMode}
                            onChange={(mode) => {
                                setLoading(true); // Trigger loading state when mode changes
                                setFeedMode(mode);
                            }}
                            setLoading={setLoading}
                    />
                </div>
                <CreatePostButton onOpen={onOpen} />
            </div>
                <div className='feed-bottom'>
                    <ScrollShadow hideScrollBar>
                    <Feed 
                        ref={feedRefresh} 
                        selectedMode={feedMode} 
                        loading={loading} 
                        setLoading={setLoading} 
                    />
                    </ScrollShadow>
                </div>
            </div>
            <Spacer x={5} />
            <div className='side-container'>
                <SearchBar className="search-box" />
                <AllUserList setAlertModal={setAlertModal} />
            </div>

            <PostModal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                refreshFeed={feedRefresh.current?.refresh || (() => console.log('Refresh function not available'))}
                setAlertModal={setAlertModal}
            />

            <AlertModal 
                isOpen={alertModal.isOpen} 
                text={alertModal.text} 
                type={alertModal.type} 
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
            />
        </div>
    );
};

export default HomePage;
