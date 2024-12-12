import API_BASE_URL from '../config';

export const uploadProfilePicture = async (file) => {
    if (!file) {
        throw new Error('Please select a file.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/upload-profile-pic`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to upload profile picture');
        }

        const data = await response.json();
        return data.profile_pic_url; // Return the new profile picture URL
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};
