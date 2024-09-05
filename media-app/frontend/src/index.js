import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Global CSS
import App from './App';  // Import the main App component

// Render the App component inside the <div id="root"></div> in public/index.html
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
