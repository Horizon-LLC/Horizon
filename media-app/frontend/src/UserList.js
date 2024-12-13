import './UserList.css';
import React, { useState } from 'react';
import API_BASE_URL from './config';

import {Button} from "@nextui-org/button";


const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);


    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/allUsers`);  // Call Flask API
            // Log the raw response to check if it's valid

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }


            const data = await response.json();
            if (response.ok) {
                console.log("Success: fetched data");
            } else {
                console.log("Failed: fetched data");
            }
            setUsers(data);
        } catch (error) {
            setError('Error fetching data');
            console.error("Fetch error:", error);  // Log the error details
        }
    };

    return (
        <div className='userlist-container'>
            <h1>Click to Get All Users</h1>
            <Button color="primary" onClick={fetchData}>Get User Data</Button>

            {error && <p>{error}</p>}
            <div id="user-data">
                {users.length > 0 && (
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>ID: {user.id}, Name: {user.username}, Email: {user.email}, User_Creation_Date{user.user_creation_date}, is_above_18{user.is_above_18}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserList;
