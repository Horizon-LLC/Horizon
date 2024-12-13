import React from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot from react-dom/client
import './index.css';  // Global CSS
import App from './App';  // Import the main App component

// Suppress "process is not defined" error by adding a fallback
if (typeof process === 'undefined') {
  window.process = { env: {} };
}

// Create a root and render the App component inside the <div id="root"></div> in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
