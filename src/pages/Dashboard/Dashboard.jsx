import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, formatTime } from '../../utils/format';
import {
  Users, CalendarDays, CheckCircle, Clock,
  DollarSign, AlertCircle, ArrowRight, TrendingUp,
  CalendarRange
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const REVENUE_FILTERS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
  { key: 'custom', label: 'Pick Date' },
];

const StatCard = ({ label, value, icon: Icon, color, sub, onClick }) => (
  <div className={`stat-card stat-${color}`} onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
    <div className="stat-icon"><Icon size={22} /></div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, appointments, clients, sales, getRevenue } = useApp();
  const navigate = useNavigate();

  const [revenueFilter, setRevenueFilter] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filteredRevenue = getRevenue(revenueFilter, customStart, customEnd);

  // Revenue label
  const revLabel = {
    today: "Today's Revenue", week: 'This Week', month: 'This Month',
    all: 'All Time', custom: 'Custom Range'
  }[revenueFilter];

  // Upcoming appointments
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments
    .filter(a => a.date >= today && (a.status === 'Confirmed' || a.status === 'Pending'))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 6);

  // Recent sales
  const recentSales = [...sales]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const statusColor = {
    Confirmed: 'badge-teal', Completed: 'badge-green',
    Pending: 'badge-orange', Cancelled: 'badge-red',
  };

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="dash-welcome">
        <div>
          <h1>Welcome back, Admin 👋</h1>
          <p>People's Physio — {new Date().toLocaleDateString('en-LK', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-gold" onClick={() => navigate('/clients')}>
            <Users size={15} /> Register Client
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/appointments')}>
            <CalendarDays size={15} /> New Appointment
          </button>
        </div>
      </div>

      {/* ── Revenue Section ── */}
      <div className="card revenue-section">
        <div className="revenue-header">
          <div>
            <h2 className="revenue-title">
              <TrendingUp size={18} /> Revenue — {revLabel}
            </h2>
            <div className="revenue-amount">{formatCurrency(filteredRevenue)}</div>
          </div>

          {/* Filter tabs */}
          <div className="rev-filter-wrap">
            <div className="rev-filter-tabs">
              {REVENUE_FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`rev-tab${revenueFilter === f.key ? ' active' : ''}`}
                  onClick={() => setRevenueFilter(f.key)}
                >
                  {f.key === 'custom' && <CalendarRange size={12} />} {f.label}
                </button>
              ))}
            </div>
            {revenueFilter === 'custom' && (
              <div className="custom-date-row">
                <input type="date" className="form-control" value={customStart}
                  onChange={e => setCustomStart(e.target.value)} />
                <span>to</span>
                <input type="date" className="form-control" value={customEnd}
                  onChange={e => setCustomEnd(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* Revenue mini-stats */}
        <div className="revenue-mini-stats">
          <div className="rev-mini">
            <span>Today</span>
            <strong>{formatCurrency(getRevenue('today'))}</strong>
          </div>
          <div className="rev-mini">
            <span>This Week</span>
            <strong>{formatCurrency(getRevenue('week'))}</strong>
          </div>
          <div className="rev-mini">
            <span>This Month</span>
            <strong>{formatCurrency(getRevenue('month'))}</strong>
          </div>
          <div className="rev-mini">
            <span>All Time</span>
            <strong>{formatCurrency(getRevenue('all'))}</strong>
          </div>
          <div className="rev-mini">
            <span>Total Sales</span>
            <strong>{stats.totalSales} records</strong>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="stats-grid">
        <StatCard
          label="Total Clients"
          value={stats.totalClients}
          icon={Users}
          color="teal"
          sub={`${stats.activeClients} active`}
          onClick={() => navigate('/clients')}
        />
        <StatCard
          label="Total Appointments"
          value={stats.totalAppointments}
          icon={CalendarDays}
          color="blue"
          sub={`${stats.todayAppointments} today`}
          onClick={() => navigate('/appointments')}
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="green"
          sub="All time collected"
          onClick={() => navigate('/sales')}
        />
        <StatCard
          label="Pending Payment"
          value={formatCurrency(stats.pendingRevenue)}
          icon={AlertCircle}
          color="orange"
          sub="Outstanding balance"
        />
        <StatCard
          label="Completed Sessions"
          value={stats.completedSessions}
          icon={CheckCircle}
          color="emerald"
          sub="Finished appointments"
        />
        <StatCard
          label="Today's Bookings"
          value={stats.todayAppointments}
          icon={Clock}
          color="gold"
          sub="Scheduled today"
          onClick={() => navigate('/schedule')}
        />
      </div>

      {/* ── Middle Row ── */}
      <div className="dash-row">
        {/* Upcoming Appointments */}
        <div className="card dash-card-wide">
          <div className="dash-card-header">
            <h2>Upcoming Appointments</h2>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/appointments')}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state"><CalendarDays /><p>No upcoming appointments</p></div>
          ) : (
            <div className="apt-list">
              {upcoming.map(a => (
                <div key={a.id} className="apt-row">
                  <div className="apt-date-box">
                    <span className="apt-day">{new Date(a.date).toLocaleDateString('en-LK', { day: '2-digit' })}</span>
                    <span className="apt-mon">{new Date(a.date).toLocaleDateString('en-LK', { month: 'short' })}</span>
                  </div>
                  <div className="apt-info">
                    <span className="apt-client">{a.clientName}</span>
                    <span className="apt-meta">{a.type} · {formatTime(a.time)} · {a.therapist}</span>
                  </div>
                  <span className={`badge ${statusColor[a.status] || 'badge-blue'}`}>{a.status}</span>
                  <span className="apt-fee">{formatCurrency(a.fee)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="dash-card-narrow" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Recent Sales */}
          <div className="card">
            <div className="dash-card-header">
              <h2>Recent Payments</h2>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/sales')}>
                All <ArrowRight size={13} />
              </button>
            </div>
            {recentSales.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>No payments recorded.</p>
            ) : (
              <div className="recent-sales-list">
                {recentSales.map(s => (
                  <div key={s.id} className="rs-row">
                    <div className="rs-avatar">{s.clientName.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                    <div className="rs-info">
                      <span className="rs-name">{s.clientName}</span>
                      <span className="rs-date">{formatDate(s.date)} · {s.sessionType}</span>
                    </div>
                    <span className="rs-amount">{formatCurrency(s.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointment status */}
          <div className="card">
            <div className="dash-card-header"><h2>Appointment Status</h2></div>
            <div className="status-breakdown">
              {[
                { label: 'Confirmed', count: stats.confirmedAppointments, cls: 'badge-teal' },
                { label: 'Completed', count: stats.completedSessions, cls: 'badge-green' },
                { label: 'Pending', count: stats.pendingAppointments, cls: 'badge-orange' },
                { label: 'Cancelled', count: stats.cancelledAppointments, cls: 'badge-red' },
              ].map(s => (
                <div key={s.label} className="status-row">
                  <span className={`badge ${s.cls}`}>{s.label}</span>
                  <div className="status-bar-wrap">
                    <div className="status-bar"
                      style={{ width: `${stats.totalAppointments ? (s.count / stats.totalAppointments) * 100 : 0}%` }} />
                  </div>
                  <span className="status-count">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
