import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Clock, Calendar, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onToggle }) => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-LK', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const timeStr = time.toLocaleTimeString('en-LK', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggle}
          title="Toggle Navigation"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        {/* Live Clock & Date Badge for Sri Lanka */}
        <div className="live-clock-badge">
          <div className="live-clock-indicator">
            <span className="live-dot"></span>
            <span className="clock-time">{timeStr}</span>
          </div>
          <div className="clock-date">
            <Calendar size={13} className="clock-icon" />
            <span>{dateStr}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button className="btn-icon header-btn notification-btn" title="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        <div className="header-user-dropdown">
          <div className="header-user">
            <div className="avatar">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="user-info hide-on-mobile">
              <span className="user-name">{user?.name || 'Physio Staff'}</span>
              <span className="user-role">{user?.role || 'Clinician'}</span>
            </div>
          </div>
          <button
            className="btn btn-outline btn-sm logout-btn"
            onClick={logout}
            title="Sign Out"
          >
            <LogOut size={14} />
            <span className="hide-on-mobile">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
