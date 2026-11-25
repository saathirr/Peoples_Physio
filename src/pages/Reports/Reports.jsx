import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1A6B72', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const Reports = () => {
  const { appointments } = useApp();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  // Appointments by type
  const byType = {};
  appointments.forEach(a => { byType[a.type] = (byType[a.type] || 0) + 1; });
  const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  // Status pie
  const byStatus = {};
  appointments.forEach(a => { byStatus[a.status] = (byStatus[a.status] || 0) + 1; });
  const statusPie = Object.entries(byStatus).map(([name, value]) => ({ name, value }));

  // Monthly revenue (last 6 months)
  const monthlyRev = {};
  appointments.filter(a => a.paid).forEach(a => {
    const m = a.date.slice(0, 7);
    monthlyRev[m] = (monthlyRev[m] || 0) + a.fee;
  });
  const revData = Object.entries(monthlyRev).sort().slice(-6).map(([month, revenue]) => ({
    month: new Date(month).toLocaleDateString('en-LK', { month: 'short', year: '2-digit' }),
    revenue
  }));

  // Therapist breakdown
  const byTherapist = {};
  appointments.forEach(a => { byTherapist[a.therapist] = (byTherapist[a.therapist] || 0) + 1; });

  return (
    <div>
      <div className="page-header">
        <div><h1>Reports & Analytics</h1><p>Clinic performance overview</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Revenue Bar Chart */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal)' }}>Monthly Revenue (LKR)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={textColor} tick={{ fontSize: 11, fill: textColor }} />
              <YAxis stroke={textColor} tick={{ fontSize: 11, fill: textColor }} tickFormatter={v => `LKR ${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  borderRadius: 8,
                }}
                formatter={v => formatCurrency(v)}
              />
              <Bar dataKey="revenue" fill={isDark ? '#2DD4BF' : '#1A6B72'} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal)' }}>Appointment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Session Types */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal)' }}>Sessions by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis type="number" stroke={textColor} tick={{ fontSize: 11, fill: textColor }} />
              <YAxis type="category" dataKey="name" stroke={textColor} tick={{ fontSize: 10, fill: textColor }} width={110} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="#C9A227" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Therapist Table */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal)' }}>Appointments by Therapist</h3>
          <table>
            <thead><tr><th>Therapist</th><th>Total</th><th>Completed</th><th>Revenue (LKR)</th></tr></thead>
            <tbody>
              {Object.keys(byTherapist).map(t => {
                const tApts = appointments.filter(a => a.therapist === t);
                const rev   = tApts.filter(a => a.paid).reduce((s, a) => s + a.fee, 0);
                return (
                  <tr key={t}>
                    <td>{t}</td>
                    <td>{tApts.length}</td>
                    <td>{tApts.filter(a => a.status === 'Completed').length}</td>
                    <td style={{ color: isDark ? '#2DD4BF' : 'var(--teal)', fontWeight: 600 }}>{formatCurrency(rev)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
