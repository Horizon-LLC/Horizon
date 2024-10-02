import React, { useState } from 'react';
import './App.css';  // Optional styling
import UserList from './UserList';  // Import the UserList component
import EntityList from './EntityListPage/EntityList';
import LoginPage from './LoginSignup/LoginPage';
import SignupPage from './LoginSignup/SignupPage';
import ProfilePage from './ProfilePage/ProfilePage';
import HomePage from './MainPage/HomePage';


import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NextUIProvider, Spacer} from "@nextui-org/react";
import {BrowserRouter, Routes, Router, Route, Link } from "react-router-dom";


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  return (
    <div className="App">
      <NextUIProvider>
        <BrowserRouter>
            <Navbar className="navbar">
              <NavbarContent className="navbar-content">
              <NavbarItem>
                  <Link className='navbar-item navbar-title' color="foreground" to="/Home">
                    HORIZON
                  </Link>
                </NavbarItem>
                <Spacer y={5}/>
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
                  <>
                    <NavbarItem>
                      <Link className='navbar-item' to="/Profile"> 
                        {loggedInUser}
                      </Link>
                    </NavbarItem>
                  </>
                ) : (
                  <NavbarItem>
                    <Link className='navbar-item' color="foreground" to="/Login">
                      Login
                    </Link>
                  </NavbarItem>
                )}
              </NavbarContent>
            </Navbar>
            

              <Routes>
                <Route exact path="/DatabaseTest" element={<UserList />} />
                <Route path="/EntityDatabase" element={<EntityList />} />
                <Route path="/Login" element={<LoginPage setLoggedInUser={setLoggedInUser} />} /> 
                <Route path="/Signup" element={<SignupPage />} />
                <Route path="/Profile" element={<ProfilePage setLoggedInUser={loggedInUser} />} />
                <Route path="/Home" element={<HomePage />} />
              </Routes>

          
        </BrowserRouter>
      </NextUIProvider>
      </div>
  );
}

export default App;
