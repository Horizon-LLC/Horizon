import './Login&Signup.css';


import React from "react";
import {Button, Card, CardBody, CardHeader, Input, Spacer} from "@nextui-org/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {BrowserRouter, Routes, Router, Route, Link } from "react-router-dom";

const LoginPage = () => {

    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className='container'>
            <Card>
                <CardHeader className='header'>
                    <h1 className='header-text'>Horizon</h1>
                </CardHeader>
                <CardBody>
                    <div className='card-container'>
                        <Input type="email" label="Email" placeholder="Enter your email" className="max-w-xs"/>
                        <Spacer y={5}/>
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <LuEye className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <LuEyeOff className="text-2xl text-default-400 pointer-events-none" />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
                        />
                        <Spacer y={5}/>
                        <Button color="primary" className="max-w-xs">
                            Login
                        </Button>
                        <Spacer y={2}/>
                        <div className='header'>
                            <p>Don't have an account? </p>
                            <Spacer />
                            <Link style={{color:"#0000EE"}} to="/Signup"> Sign up</Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
};

export default LoginPage;