import React, { useState } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/data');  // Call Flask API
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError('Error fetching data');
        }
    };

    return (
        <div>
            <h1>Click to Get All Users</h1>
            <button onClick={fetchData}>Get User Data</button>

            {error && <p>{error}</p>}
            <div id="user-data">
                {users.length > 0 && (
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>ID: {user.id}, Name: {user.name}, Email: {user.email}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserList;
