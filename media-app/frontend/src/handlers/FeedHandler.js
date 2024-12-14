import API_BASE_URL from '../config';


export const fetchPosts = async (page, setLoading, setPosts, props ) => {
    console.log('Fetching posts for page:', page, 'Mode:', props.selectedMode); // Debug log
    setLoading(true); // Start loading
    setPosts([]); // Clear stale posts

    const token = localStorage.getItem('token');
    const endpoint = (props.selectedMode === 'following')
        ? '/dashboard/following'
        : '/dashboard';

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}?limit=7&offset=${page * 7}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Posts fetched:', data.posts); // Debug log
            setPosts(data.posts);
        } else {
            console.error('Failed to fetch posts:', data.error);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        setLoading(false); // End loading
    }
};