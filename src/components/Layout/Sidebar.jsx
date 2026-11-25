import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarDays, ClipboardList,
  Settings, ChevronRight, Activity, ShoppingBag, X
} from 'lucide-react';
import logo from '../../assets/logo.jpg';

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/clients',      icon: Users,           label: 'Clients'        },
  { to: '/appointments', icon: CalendarDays,    label: 'Appointments'   },
  { to: '/schedule',     icon: ClipboardList,   label: 'Daily Schedule' },
  { to: '/sales',        icon: ShoppingBag,     label: 'Sales & Payments'},
  { to: '/reports',      icon: Activity,        label: 'Reports'        },
  { to: '/settings',     icon: Settings,        label: 'Settings'       },
];

const Sidebar = ({ collapsed, mobileOpen, closeMobile }) => (
  <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
    {/* Logo */}
    <div className="sidebar-logo">
      <img src={logo} alt="People's Physio" className="logo-img" />
      {(!collapsed || mobileOpen) && (
        <div className="logo-text">
          <span className="logo-name">People's Physio</span>
          <span className="logo-sub">Admin Portal</span>
        </div>
      )}
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={closeMobile} aria-label="Close menu">
        <X size={20} />
      </button>
    </div>

    {/* Nav */}
    <nav className="sidebar-nav">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={closeMobile}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={19} className="nav-icon" />
          {(!collapsed || mobileOpen) && <span>{label}</span>}
          {(!collapsed || mobileOpen) && <ChevronRight size={14} className="nav-arrow" />}
        </NavLink>
      ))}
    </nav>

    {(!collapsed || mobileOpen) && (
      <div className="sidebar-footer">
        <span>© 2025 People's Physio</span>
        <span className="sidebar-footer-sub">Sri Lanka Health Portal</span>
      </div>
    )}
  </aside>
);

export default Sidebar;
