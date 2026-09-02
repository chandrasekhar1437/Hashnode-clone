import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

export default function TagPage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        const { data } = await API.get('/posts');
        const filtered = data.filter(post => post.tags?.some(tag => tag.slug === slug));
        setPosts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByTag();
  }, [slug]);

  if (loading) return <div>Loading tag posts...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Posts tagged with #{slug}</h2>
      {posts.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No posts found for this tag.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ borderBottom: '1px solid #eaeaea', padding: '1.5rem 0' }}>
            <h3>
              <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none', color: '#000' }}>{post.title}</Link>
            </h3>
            <p style={{ color: '#555' }}>{post.excerpt}</p>
            <small style={{ color: '#888' }}>
              By {post.author?.name} on {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}