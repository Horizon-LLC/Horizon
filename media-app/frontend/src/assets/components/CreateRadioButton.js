import React from 'react';

const CreateRadioButton = ({ selectedMode, onChange, setLoading }) => {
    return (
        <div className="feed-settings">
            <label>
                <input
                    type="radio"
                    name="feedMode"
                    value="explore"
                    checked={selectedMode === 'explore'}
                    onChange={(e) => {
                        setLoading(true); // Trigger loading state
                        onChange(e.target.value);
                    }}
                />
                Explore
            </label>
            <label>
                <input
                    type="radio"
                    name="feedMode"
                    value="following"
                    checked={selectedMode === 'following'}
                    onChange={(e) => {
                        setLoading(true); // Trigger loading state
                        onChange(e.target.value);
                    }}
                />
                Following
            </label>
        </div>
    );
};

export default CreateRadioButton;
