import './LoginSignup.css';
import React, { useState } from "react"; 
import { Button, Card, CardBody, CardHeader, Input, Spacer } from "@nextui-org/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from '../handlers/UserHandler';
import { textChange } from '../handlers/FormChanges';

const LoginPage = ({ setLoggedInUser, setLoggedInUserId } ) => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    return (
        <div className='logsign-container'>
            <Card className="card-container">
                <CardHeader className='header'>
                    <h1 className='header-text'>Horizon</h1>
                </CardHeader>
                <CardBody>
                    <form onSubmit={(e) => signIn(loginData, setLoggedInUser, setLoggedInUserId, navigate, e)} className='login-card'>
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            placeholder="Enter your email"
                            className="input-field"
                            onChange={(e) => textChange(e, loginData, setLoginData)}
                        />
                        <Spacer y={5} />
                        <Input
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label="toggle password visibility"
                                >
                                    {isVisible ? (
                                        <LuEye className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <LuEyeOff className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="input-field"
                            onChange={(e) => textChange(e, loginData, setLoginData)}
                        />
                        <Spacer y={5} />
                        <Button color="primary" type="submit" className="input-field">
                            Login
                        </Button>
                        <Spacer y={2} />
                        <div className='header'>
                            <p>Don't have an account? </p>
                            <Spacer />
                            <Link style={{ color: "#0000EE" }} to="/Signup"> Sign up</Link>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default LoginPage;
