import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import './PostEditor.css';

export default function PostEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      API.get(`/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setCoverImage(res.data.coverImage || '');
          setTags(res.data.tags ? res.data.tags.join(', ') : '');
        })
        .catch((err) => setError('Failed to load post for editing'));
    }
  }, [id, isEditing]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedTags = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      const postData = { title, content, coverImage, tags: formattedTags };

      if (isEditing) {
        await API.put(`/posts/${id}`, postData);
      } else {
        await API.post('/posts', postData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    }
  };

  return (
    <div className="post-editor-container">
      <h2>{isEditing ? 'Edit Post' : 'Create a New Post'}</h2>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit} className="post-editor-form">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Upload Cover Image (Optional)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {coverImage && (
          <div className="image-preview-wrapper">
            <img src={coverImage} alt="Cover Preview" className="cover-preview" />
            <button type="button" onClick={() => setCoverImage('')} className="remove-img-btn">
              Remove Image
            </button>
          </div>
        )}

        <label>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="react, node, webdev"
        />

        <label>Content</label>
        <textarea
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit" className="submit-post-btn">
          {isEditing ? 'Update Post' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}