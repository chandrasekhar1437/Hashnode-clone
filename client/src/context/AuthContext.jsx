import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo') || localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {
        setUser({ token: userInfo, name: userName });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    if (data.name) localStorage.setItem('userName', data.name);
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    if (data.name) localStorage.setItem('userName', data.name);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/users/profile', profileData);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};