import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpg';
import './Login.css';

const Login = () => {
  const { login, error, setError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(username, password);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="login-bg">
      {/* Background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <img src={logo} alt="People's Physio" className="login-logo" />
        </div>

        <div className="login-brand">
          <h1>People's Physio</h1>
          <p>Admin Portal — Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">👤</span>
              <input
                className="form-control login-input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                className="form-control login-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                required
              />
              <button type="button" className="login-eye" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        <div className="login-hint">
          <span>Default: <code>admin</code> / <code>physio@2025</code></span>
        </div>

        <div className="login-footer">
          © 2025 People's Physio · Colombo, Sri Lanka
        </div>
      </div>
    </div>
  );
};

export default Login;

