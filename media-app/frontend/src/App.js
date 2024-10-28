import React, { useState } from 'react';
import './App.css';
import UserList from './UserList';
import EntityList from './EntityListPage/EntityList';
import LoginPage from './LoginSignup/LoginPage';
import SignupPage from './LoginSignup/SignupPage';
import ProfilePage from './ProfilePage/ProfilePage';
import HomePage from './MainPage/HomePage';
import ChatPage from './ChatPage/ChatPage';
import FriendsPage from './FriendsPage/Friends';
import UserProfile from './UserPage/UserProfile';

import { Navbar, NavbarContent, NavbarItem, NextUIProvider, Spacer } from "@nextui-org/react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const WebNavbar = () => {
    const location = useLocation();
  
    if (location.pathname === '/Login' || location.pathname === '/Signup') {
      return null;
    }
  
    return (
      <Navbar className="navbar">
        <NavbarContent className="navbar-content">
          <NavbarItem>
            <Link className='navbar-item navbar-title' color="foreground" to="/Home">
              HORIZON
            </Link>
          </NavbarItem>
          <Spacer y={5} />
          <NavbarItem>
            <Link className='navbar-item' color="foreground" to="/Home">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='navbar-item' color="foreground" to="/Friends">
              Friends
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='navbar-item' color="foreground" to="/DatabaseTest">
              Database Test
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='navbar-item' color="foreground" to="/EntityDatabase">
              Entity Database
            </Link>
          </NavbarItem>
          {loggedInUser ? (
            <NavbarItem>
              <Link className='navbar-item' to="/Profile"> 
                {loggedInUser}
              </Link>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Link className='navbar-item' color="foreground" to="/Login">
                Login
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    );
  };

  return (
    <div className="App">
      <NextUIProvider>
        <BrowserRouter>
          <WebNavbar />
          <div className='main-container'>
            <Routes>
              <Route path="/" element={<Navigate to="/Login" />} />
              <Route path="/DatabaseTest" element={<UserList />} />
              <Route path="/EntityDatabase" element={<EntityList />} />
              <Route path="/Login" element={<LoginPage setLoggedInUser={setLoggedInUser} setLoggedInUserId={setLoggedInUserId} />} /> 
              <Route path="/Signup" element={<SignupPage />} />
              <Route path="/Profile" element={<ProfilePage setLoggedInUser={setLoggedInUser} loggedInUserId={loggedInUserId} />} />
              <Route path="/Home" element={<HomePage loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setLoggedInUserId={setLoggedInUserId} />} />
              <Route path="/ChatTest" element={<ChatPage loggedInUser={loggedInUser}/>} />
              <Route path="/Friends" element={<FriendsPage />} />
              <Route path="/user/:userId" element={<UserProfile loggedInUser={loggedInUser} loggedInUserId={loggedInUserId}/>} />
              <Route path="/chat/:chatboxId" element={<ChatPage loggedInUser={loggedInUser} loggedInUserId={loggedInUserId}/>} />
            </Routes>
          </div>
        </BrowserRouter>
      </NextUIProvider>
    </div>
  );
}

export default App;
