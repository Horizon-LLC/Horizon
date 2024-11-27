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

const HomePage = ({ loggedInUser, setLoggedInUser, setLoggedInUserId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const [alertModal, setAlertModal] = useState({ isOpen: false, text: '', type: '' });
    const feedRefresh = useRef(null);   

    

    return (
        <div className='home-container' >
            <div className='center-container'>
                <div className='feed-top'>
                    <CreatePostButton onOpen={onOpen} />
                </div>
                <div className='feed-bottom'>
                    <ScrollShadow hideScrollBar>
                        <Feed ref={feedRefresh} />
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
                feedRefresh={feedRefresh}
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
