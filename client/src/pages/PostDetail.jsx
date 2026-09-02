import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

export default function PostEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('published');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const { data } = await API.get('/posts');
          const postToEdit = data.find(p => p._id === id);
          if (postToEdit) {
            setTitle(postToEdit.title);
            setContent(postToEdit.content);
            setExcerpt(postToEdit.excerpt || '');
            setCoverImage(postToEdit.coverImage || '');
            setStatus(postToEdit.status || 'published');
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/posts/${id}`, { title, content, excerpt, coverImage, status });
      } else {
        await API.post('/posts', { title, content, excerpt, coverImage, status });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Post Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '0.5rem', fontSize: '1rem' }} 
        />
        <input 
          type="text" 
          placeholder="Cover Image URL (Optional)" 
          value={coverImage} 
          onChange={(e) => setCoverImage(e.target.value)} 
          style={{ padding: '0.5rem' }} 
        />
        <textarea 
          placeholder="Short Excerpt (Optional)" 
          value={excerpt} 
          onChange={(e) => setExcerpt(e.target.value)} 
          rows="2" 
          style={{ padding: '0.5rem' }} 
        />
        <textarea 
          placeholder="Write your post content here..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          rows="12" 
          required 
          style={{ padding: '0.5rem' }} 
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '0.75rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {isEditing ? 'Update Post' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}