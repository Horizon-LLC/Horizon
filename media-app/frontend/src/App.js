import React, { useState, useEffect } from 'react';
import './App.css';
import UserList from './UserList';
//import EntityList from './EntityListPage/EntityList';
import LoginPage from './LoginSignup/LoginPage';
import SignupPage from './LoginSignup/SignupPage';
import ProfilePage from './ProfilePage/ProfilePage';
import HomePage from './MainPage/HomePage';
import ChatPage from './ChatPage/ChatPage';
import FriendsPage from './FriendsPage/Friends';
import UserProfile from './UserPage/UserProfile';
import WebNavbar from './assets/components/WebNavbar';
import SelectedPost from './MainPage/SelectedPost';


import {NextUIProvider} from "@nextui-org/react";
import {BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";


function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Initialize user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');

    if (storedUser && storedToken) {
      setLoggedInUser(storedUser);
      setLoggedInUserId(storedUserId);
    }
    else {
      localStorage.removeItem('token');    // Remove token from local storage
      localStorage.removeItem('username');
      localStorage.removeItem('user_id');
    }
  }, []);

  
  
  return (
    <div className="App">
      <NextUIProvider>
        <BrowserRouter>
          <WebNavbar loggedInUser={loggedInUser} showNavbar={!["/Login", "Signup"].includes(window.location.pathname)} />
          <div className={`main-container ${["/Login", "/Signup"].includes(window.location.pathname) ? "" : "with-navbar"}`}>
            <Routes>
              <Route path="/" element={<Navigate to="/Login" />} />
              <Route path="/Login" element={<LoginPage setLoggedInUser={setLoggedInUser} setLoggedInUserId={setLoggedInUserId} />} /> 
              <Route path="/Signup" element={<SignupPage />} />
              <Route path="/Profile" element={<ProfilePage setLoggedInUser={setLoggedInUser} loggedInUserId={loggedInUserId} />} />
              <Route path="/Home" element={<HomePage loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setLoggedInUserId={setLoggedInUserId} />} />
              <Route path="/ChatTest" element={<ChatPage loggedInUser={loggedInUser}/>} />
              <Route path="/Friends" element={<FriendsPage />} />
              <Route path="/user/:userId" element={<UserProfile loggedInUser={loggedInUser} loggedInUserId={loggedInUserId}/>} />
              <Route path="/chat/:chatboxId" element={<ChatPage loggedInUser={loggedInUser} loggedInUserId={loggedInUserId}/>} />
              <Route path="/post/:postId" element={<SelectedPost loggedInUser={loggedInUser} loggedInUserId={loggedInUserId}/>} />
            </Routes>
          </div>
        </BrowserRouter>
      </NextUIProvider>
    </div>
  );
}

export default App;
