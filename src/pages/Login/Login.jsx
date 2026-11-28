import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpg';
import './Login.css';

/* ── floating medical icons ─────────────────────────── */
const ICONS = ['🫀','🩺','💊','🧬','🩻','❤️‍🩹','🏥','🩹','⚕️','🔬'];
const FloatingIcons = () => (
  <div className="lp-floaters" aria-hidden="true">
    {ICONS.map((icon, i) => (
      <span
        key={i}
        className="lp-floater"
        style={{
          left: `${5 + (i * 9.5)}%`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${6 + (i % 4)}s`,
          fontSize: `${18 + (i % 3) * 6}px`,
          opacity: 0.13 + (i % 3) * 0.04,
        }}
      >
        {icon}
      </span>
    ))}
  </div>
);

/* ── animated wave SVG ───────────────────────────────── */
const Waves = () => (
  <div className="lp-waves" aria-hidden="true">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path className="lp-wave lp-wave-1" d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"/>
      <path className="lp-wave lp-wave-2" d="M0,80 C400,20 1040,140 1440,80 L1440,120 L0,120 Z"/>
    </svg>
  </div>
);

/* ── main component ──────────────────────────────────── */
const Login = () => {
  const { login, error, setError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [shake,    setShake]    = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  /* shake on error */
  useEffect(() => {
    if (error) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (ok === false) {
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    }, 900);
  };

  /* animation variants */
  const panelVariants = {
    hidden:  { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };
  const cardVariants = {
    hidden:  { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
  };
  const stagger = {
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };
  const item = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="lp-root">
      {/* ── LEFT BRAND PANEL ────────────────────────── */}
      <motion.div
        className="lp-brand-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        <FloatingIcons />
        <Waves />

        <div className="lp-brand-content">
          <motion.div
            className="lp-brand-logo-wrap"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.4, delay: 0.4 }}
          >
            <img src={logo} alt="People's Physio" className="lp-brand-logo" />
            <div className="lp-logo-ring" />
          </motion.div>

          <motion.h1
            className="lp-brand-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            People's Physio
          </motion.h1>

          <motion.p
            className="lp-brand-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
          >
            Healing with Heart · Colombo, Sri Lanka
          </motion.p>

          <motion.div
            className="lp-brand-pills"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {['Client Management','Revenue Tracking','Smart Scheduling'].map(t => (
              <span key={t} className="lp-pill">{t}</span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── RIGHT FORM PANEL ───────────────────────── */}
      <div className="lp-form-panel">
        <motion.div
          className={`lp-card${shake ? ' lp-card-shake' : ''}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* mobile logo */}
          <div className="lp-mobile-logo">
            <img src={logo} alt="People's Physio" />
            <span>People's Physio</span>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={item} className="lp-card-header">
              <h2>Welcome back</h2>
              <p>Sign in to your admin portal</p>
            </motion.div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="lp-error"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 14 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="lp-error-icon">⚠</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <motion.div variants={item} className={`lp-field${userFocus || username ? ' lp-field-active' : ''}`}>
                <label className="lp-label">Username</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="lp-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(''); }}
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="lp-field-bar" />
              </motion.div>

              {/* Password */}
              <motion.div variants={item} className={`lp-field${passFocus || password ? ' lp-field-active' : ''}`}>
                <label className="lp-label">Password</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="lp-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    onFocus={() => setPassFocus(true)}
                    onBlur={() => setPassFocus(false)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowPass(s => !s)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <div className="lp-field-bar" />
              </motion.div>

              {/* Submit */}
              <motion.button
                variants={item}
                type="submit"
                className={`lp-btn${success ? ' lp-btn-success' : ''}`}
                disabled={loading || success}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(26,107,114,0.45)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="lp-spinner" />
                ) : success ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="lp-check"
                  >✓ Signed In</motion.span>
                ) : (
                  <span className="lp-btn-text">
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                )}
              </motion.button>
            </form>

            {/* Demo credentials notice */}
            <motion.div variants={item} className="lp-hint">
              <span className="lp-hint-label">Demo credentials</span>
              <code>admin</code> / <code>physio@2025</code>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <div className="lp-footer">
            <span>© 2025 People's Physio</span>
            <span className="lp-sep">·</span>
            <span>Colombo, Sri Lanka</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
