import React, { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import {CircularProgress} from "@nextui-org/react";

const GenericTable = ({ apiEndpoint, title }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch data
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://127.0.0.1:5000/${apiEndpoint}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError("Error fetching data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card>
            <CardBody>
                <h2>{title}</h2>
                {loading && <CircularProgress aria-label="Loading..." />}
                {error && <p>{error}</p>}
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            {Object.keys(item).map((key) => (
                                <div key={key}>
                                    <strong>{key}:</strong> {item[key]}
                                </div>
                            ))}
                            <hr />
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
};

export default GenericTable;
