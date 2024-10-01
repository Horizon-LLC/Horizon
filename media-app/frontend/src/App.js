import React, { useState } from 'react';
import './App.css';  // Optional styling
import UserList from './UserList';  // Import the UserList component
import EntityList from './EntityListPage/EntityList';
import LoginPage from './LoginSignup/LoginPage';
import SignupPage from './LoginSignup/SignupPage';
import ProfilePage from './ProfilePage/ProfilePage';
import HomePage from './MainPage/HomePage';

import {NextUIProvider} from "@nextui-org/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Divider} from "@nextui-org/react";
import {BrowserRouter, Routes, Router, Route, Link } from "react-router-dom";

// Render the UserList component
function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  return (
      <NextUIProvider>
        <BrowserRouter>
          <div className="App">
            <Navbar className="dark text-foreground bg-background w-full navbar">
              <p className="font-bold text-inherit">HORIZON</p>
              <NavbarContent className="hidden sm:flex gap-4 navbar-content flex-1 justify-end items-center">
                <NavbarItem>
                  <Link color="foreground" to="/DatabaseTest">
                    Database Test
                  </Link>
                </NavbarItem>
                <Divider orientation="vertical" />
                <NavbarItem>
                  <Link color="foreground" to="/EntityDatabase">
                    Entity Database
                  </Link>
                </NavbarItem>
                <Divider orientation="vertical" />
                {loggedInUser ? (
                  <>
                    <NavbarItem>
                      <Link to="/Profile"> {/* Make username clickable */}
                        {loggedInUser}
                      </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" />
                  </>
                ) : (
                  <NavbarItem>
                    <Link color="foreground" to="/Login">
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
              <Route path="/Profile" element={<ProfilePage setLoggedInUser={setLoggedInUser} />} />
              <Route path="/Home" element={<HomePage setLoggedInUser={setLoggedInUser} />} />
            </Routes>
          </div>
        </BrowserRouter>
      </NextUIProvider>
  );
}

export default App;
