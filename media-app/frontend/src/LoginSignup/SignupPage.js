import './LoginSignup.css';

import React, {useState} from "react";
import {Button, Card, CardBody, CardHeader, Input, Spacer, DateInput, Select, SelectItem} from "@nextui-org/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {getLocalTimeZone, today} from "@internationalized/date";
import {questions} from './questions';
import { useNavigate, Link } from 'react-router-dom'; 
import { createAcc } from '../handlers/UserHandler';
import { textChange, dateChange, selectChange } from '../handlers/FormChanges';

const SignupPage = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        date_of_birth: '',
        password: '',
        security_question: '',
        security_answer: '',
        confirmPassword: ''
    });
    
    return (
        <div className='logsign-container'>
            <Card>
                <CardHeader className='header'>
                    <h1 className='header-text'>Horizon</h1>
                </CardHeader>
                <CardBody>
                    <form onSubmit={(e) => createAcc(e, formData, navigate)} className='signup-card'>
                        <Input isRequired type="text" label="First Name" name="first_name" placeholder="Enter your First Name" className="max-w-xs" onChange={(e) => textChange(e, formData, setFormData)}/>
                        <Spacer y={5}/>
                        <Input isRequired type="text" label="Last Name" name="last_name" placeholder="Enter your Last Name" className="max-w-xs" onChange={(e) => textChange(e, formData, setFormData)}/>
                        <Spacer y={5}/>
                        <Input isRequired type="text" label="User Name" name="username" placeholder="Enter your User Name" className="max-w-xs" onChange={(e) => textChange(e, formData, setFormData)}/>
                        <Spacer y={5}/>
                        <DateInput 
                        className="max-w-xs"
                        label={"Date of Birth"} 
                        isRequired
                        name="date_of_birth"
                        onChange={(value) => dateChange(value, formData, setFormData)}
                        minValue={today(getLocalTimeZone()).subtract({years: 100})}
                        maxValue={today(getLocalTimeZone()).subtract({days: 1})}
                        />
                        <Spacer y={5}/>
                        <Select
                            isRequired
                            label="Security Question"
                            placeholder="Select a question"
                            className="max-w-xs"
                            name="security_question"
                            value={formData.security_question}
                            onChange={(choice) => selectChange(choice, formData, setFormData)}
                        >
                            {questions.map((question) => (
                                <SelectItem key={question.key} value={question.label}>
                                    {question.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Spacer y={5}/>
                        <Input isRequired type="text" label="Security Question" name="security_answer" placeholder="Answer" className="max-w-xs" onChange={(e) => textChange(e, formData, setFormData)} />
                        <Spacer y={5}/>
                        <Input isRequired type="email" label="Email" name="email" placeholder="Enter your email" className="max-w-xs" onChange={(e) => textChange(e, formData, setFormData)} />
                        <Spacer y={5}/>
                        <Input
                            isRequired
                            label="Password"
                            name="password"
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
                            onChange={(e) => textChange(e, formData, setFormData)}
                        />
                        <Spacer y={5}/>
                        <Button color="primary" type="submit" className="max-w-xs">
                            Signup
                        </Button>
                        </form>
                        <div className='header'>
                            <p>Return to </p>
                            <Spacer />
                            <Link style={{ color: "#0000EE" }} to="/Login"> Login Page</Link>
                        </div>
                </CardBody>
            </Card>
        </div>
    )
};

export default SignupPage;