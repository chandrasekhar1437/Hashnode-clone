import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import './Navbar.css';

import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import TagPage from './pages/TagPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostEditor from './pages/PostEditor';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">Hashnode Clone</NavLink>
      <div className="navbar-links">
        <NavLink to="/" end>Feed</NavLink>
        {user ? (
          <>
            <NavLink to="/write">Write Post</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button onClick={logout} className="logout-btn">Logout ({user.name})</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="register-btn">Register</NavLink>
          </>
        )}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <div style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/tag/:slug" element={<TagPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/write" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}