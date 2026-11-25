import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ── Credentials (change these to your preferred login) ──────────────────
const USERS = [
  { username: 'admin',    password: 'physio@2025', name: 'Admin',          role: 'Administrator' },
  { username: 'physio1',  password: 'physio@2025', name: 'Dr. Amali W.',   role: 'Physiotherapist' },
  { username: 'physio2',  password: 'physio@2025', name: 'Dr. Kasun R.',   role: 'Physiotherapist' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore session from localStorage
    try {
      const saved = localStorage.getItem('pp_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [error, setError] = useState('');

  const login = (username, password) => {
    const found = USERS.find(
      u => u.username === username.trim() && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('pp_user', JSON.stringify(safeUser));
      setError('');
      return true;
    } else {
      setError('Invalid username or password.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

