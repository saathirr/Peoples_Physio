import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity } from 'lucide-react';

const COLORS = ['#1A6B72', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const Reports = () => {
  const { appointments, clients } = useApp();

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
          <h3 style={{ marginBottom: 16, color: 'var(--teal-dark)' }}>Monthly Revenue (LKR)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `LKR ${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#1A6B72" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal-dark)' }}>Appointment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Session Types */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal-dark)' }}>Sessions by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
              <Tooltip />
              <Bar dataKey="value" fill="#C9A227" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Therapist Table */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal-dark)' }}>Appointments by Therapist</h3>
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
                    <td style={{ color: 'var(--teal)', fontWeight: 600 }}>{formatCurrency(rev)}</td>
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

