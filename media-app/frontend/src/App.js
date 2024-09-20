import React from 'react';
import './App.css';  // Optional styling
import UserList from './UserList';  // Import the UserList component
import EntityList from './EntityListPage/EntityList';

import {NextUIProvider} from "@nextui-org/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import {BrowserRouter, Routes, Router, Route, Link } from "react-router-dom";

// Render the UserList component
function App() {
  return (
      <NextUIProvider>
        <BrowserRouter>
          <div className="App">
            <Navbar className="dark text-foreground bg-background">
              <p className="font-bold text-inherit">HORIZON</p>
              <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                  <Link color="foreground" to="/DatabaseTest">
                    Database Test
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="foreground" to="/EntityDatabase">
                    Entity Database
                  </Link>
                </NavbarItem>
              </NavbarContent>
            </Navbar>
            
            <Routes>
              <Route exact path="/DatabaseTest" element={<UserList />} />
              <Route path="/EntityDatabase" element={<EntityList />} />
            </Routes>
          </div>
        </BrowserRouter>
      </NextUIProvider>
  );
}

export default App;
