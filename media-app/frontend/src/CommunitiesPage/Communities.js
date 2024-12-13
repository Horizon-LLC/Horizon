import React, { useState, useEffect } from "react";
import API_BASE_URL from '../config';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });

  // Fetch communities from the backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/get-communities`)
      .then((response) => response.json())
      .then((data) => setCommunities(data))
      .catch((err) => console.error("Error fetching communities:", err));
  }, []);

  // Handle input changes for new community
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunity((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new community to the backend
  const handleCreateCommunity = () => {
    fetch(`${API_BASE_URL}/create-community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCommunity),
    })
      .then((response) => response.json())
      .then((newCommunity) => {
        setCommunities((prev) => [...prev, newCommunity]);
        setShowModal(false); // Close modal
        setNewCommunity({ name: "", description: "" }); // Reset form
      })
      .catch((err) => console.error("Error creating community:", err));
  };

  return (
    <div className="communities-container">
      <div className="communities-container-2">
        <h1>All Communities</h1>
        <button onClick={() => setShowModal(true)} className="create-community-button">
          Create Community
        </button>

        <div className="community-list">
          {communities.map((community) => (
            <div key={community.id} className="community-card">
              <h2>{community.name}</h2>
              <p>{community.description}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create a New Community</h2>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newCommunity.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={newCommunity.description}
                  onChange={handleInputChange}
                />
              </label>
              <button onClick={handleCreateCommunity}>Complete</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
            <div className="modal-overlay" onClick={() => setShowModal(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;
