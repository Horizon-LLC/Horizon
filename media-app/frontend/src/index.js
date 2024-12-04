import React from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot from react-dom/client
import './index.css';  // Global CSS
import App from './App';  // Import the main App component
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter

// Create a root and render the App component inside the <div id="root"></div> in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>

            <App />

    </React.StrictMode>
);
