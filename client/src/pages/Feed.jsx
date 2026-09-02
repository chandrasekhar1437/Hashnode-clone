import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import './Feed.css';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    API.get('/posts')
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch posts');
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

  if (loading) return <div className="loading-state">Loading feed...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="feed-container">
      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available. Be the first to write one!</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="post-card-img" />
            )}
            <div className="post-card-content">
              <h3>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h3>
              <p className="post-snippet">{post.content.substring(0, 150)}...</p>
              <div className="post-meta">
                <span>By {post.author?.name || 'Anonymous'}</span>
                <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {user && post.author && (user._id === post.author._id || user._id === post.author) && (
                <div className="post-actions">
                  <Link to={`/edit/${post._id}`} className="edit-btn">Edit</Link>
                  <button onClick={() => handleDelete(post._id)} className="delete-btn">
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}