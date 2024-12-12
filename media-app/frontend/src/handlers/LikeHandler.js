import API_BASE_URL from '../config';


// Check if the post is liked by the current user
export const isLiked = async (postId) => {
  try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/is-liked?post_id=${postId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.isLiked; // Returns true or false
  } catch (error) {
    console.error('Error checking like:', error);
    return false;
  }
};
 
// Create a like for a post
export const createLike = async (postId) => {
  try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/create-like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({post_id: postId}),
        });

        if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return true;
  } catch (error) {
    console.error('Error creating like:', error);
    return false;
  }
};

// Get the total number of likes for a post
export const getTotalLikes = async (postId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/total-likes?post_id=${postId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.totalLikes; // Returns the total likes count
  } catch (error) {
    console.error('Error fetching total likes:', error);
    return 0;
  }
};

// Delete a like for a post
export const deleteLike = async (postId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/delete-like`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({post_id: postId}),
        });
    
        if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return true;
  } catch (error) {
    console.error('Error deleting like:', error);
    return false;
  }
};


export const toggleLike = async (postId, liked, setLiked, setLikeCount) => {
    if (liked) {
      const success = await deleteLike(postId); 
      if (success) {
        setLiked(false);
        setLikeCount((prevCount) => prevCount - 1); 
      }
    } 
    else {
      const success = await createLike(postId); 
      if(success)
      {
        setLiked(true);
        setLikeCount((prevCount) => prevCount + 1); 
      } 
    }
  };
  
  export const fetchLikeData = async (postId, setLiked, setLikeCount) => {
    const likedStatus = await isLiked(postId); 
    const totalLikes = await getTotalLikes(postId); 
    setLiked(likedStatus);
    setLikeCount(totalLikes);
  };