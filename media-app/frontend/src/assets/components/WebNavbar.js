import { Navbar, NavbarContent, NavbarItem, Spacer } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";

export const WebNavbar = ({loggedInUser}) => {
    const location = useLocation();
  
    if (location.pathname === '/Login' || location.pathname === '/Signup') {
      return null;
    }
  
    return (
      <Navbar className="navbar">
        <NavbarContent className="navbar-content">
          <NavbarItem className="navbar-title-cont">
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

export default WebNavbar;