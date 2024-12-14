import API_BASE_URL from '../config';
import { showErrorMess } from './SystemNotification';



const getComments = async (token, post_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-comments/${post_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token if needed
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        return result; // Assuming your API returns comments as a JSON object
      } else {
        alert(result.error || 'Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('An error occurred while fetching comments');
    }
  };
  
  export const fetchComments = async (token, post_id, setComments) => {
    try {
        const fetchedComments = await getComments(token, post_id);
        setComments(fetchedComments.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
  };

  export const createComment = async (token, post_id, message, feedRefresh) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-comment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: post_id,
        content: message,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      feedRefresh.current.refresh();
      return result; // You may want to return the newly created comment or success message
    } else {
      alert(result.error || 'Failed to post comment');
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    alert('An error occurred while posting the comment');
  }
};

export const editComment = async (token, comment_id, newContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/edit-comment/${comment_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        return result; // Optionally, return the updated comment
      } else {
        alert(result.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('An error occurred while editing the comment');
    }
  };
  
  export const deleteComment = async (token, comment_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-comment/${comment_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Comment deleted successfully');
        return result; // Optionally, return the result or confirmation
      } else {
        alert(result.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('An error occurred while deleting the comment');
    }
  };
  