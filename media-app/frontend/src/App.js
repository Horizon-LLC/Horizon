import React from 'react';
import './App.css';  // Optional styling
import UserList from './UserList';  // Import the UserList component

// Render the UserList component
function App() {
  return (
      <div className="App">
        <UserList />  {/* Display the UserList component */}
      </div>
  );
}

export default App;
