import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './Dashboard.css';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/posts/my-posts')
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load your posts');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        setPosts(posts.filter((post) => post._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Your Dashboard</h2>
        <Link to="/write" className="create-post-btn">Create New Post</Link>
      </div>

      {posts.length === 0 ? (
        <p className="no-posts-text">You haven't written any posts yet.</p>
      ) : (
        <div className="dashboard-posts-list">
          {posts.map((post) => (
            <div key={post._id} className="dashboard-post-card">
              <div>
                <h3><Link to={`/post/${post._id}`}>{post.title}</Link></h3>
                <span className="post-date">Published on {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="dashboard-actions">
                <Link to={`/edit/${post._id}`} className="dashboard-edit-btn">Edit</Link>
                <button onClick={() => handleDelete(post._id)} className="dashboard-delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}