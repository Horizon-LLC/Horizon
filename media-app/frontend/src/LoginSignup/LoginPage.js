import './LoginSignup.css';
import React, { useState } from "react"; 
import { Button, Card, CardBody, CardHeader, Input, Spacer } from "@nextui-org/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from '../config'; 

const LoginPage = ({ setLoggedInUser, setLoggedInUserId } ) => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', result.token); // Store the JWT token
                setLoggedInUser(result.username);
                setLoggedInUserId(result.user_id);
                navigate('/Home');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert("There was an error connecting to the server. Please try again.");
        }
    };

    return (
        <div className='logsign-container'>
            <Card className="card-container">
                <CardHeader className='header'>
                    <h1 className='header-text'>Horizon</h1>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className='login-card'>
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            placeholder="Enter your email"
                            className="input-field"
                            onChange={handleChange}
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
                            onChange={handleChange}
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
