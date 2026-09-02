import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await updateProfile({ name, bio, avatarUrl, password: password || undefined });
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Profile Settings</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '0.5rem' }} />

        <label>Email (Cannot be changed):</label>
        <input type="email" value={user?.email || ''} disabled style={{ padding: '0.5rem', background: '#f5f5f5' }} />

        <label>Bio:</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" maxLength="200" style={{ padding: '0.5rem' }} />

        <label>Avatar URL:</label>
        <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} style={{ padding: '0.5rem' }} />

        <label>New Password (leave blank to keep current):</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '0.5rem' }} />

        <button type="submit" style={{ padding: '0.75rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}