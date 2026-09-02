import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Hashnode Clone</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Feed</Link>
        {user ? (
          <>
            <Link to="/write" className="nav-write-btn">Write Post</Link>
            <span className="nav-username">Hi, {user.name || 'User'}</span>
            <button onClick={logout} className="nav-logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}