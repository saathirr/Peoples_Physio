import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/format';
import { Receipt, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const Billing = () => {
  const { appointments } = useApp();

  const paid   = appointments.filter(a => a.paid);
  const unpaid = appointments.filter(a => !a.paid && a.status !== 'Cancelled');
  const totalRev     = paid.reduce((s, a) => s + a.fee, 0);
  const pendingRev   = unpaid.reduce((s, a) => s + a.fee, 0);
  const totalFees    = appointments.filter(a => a.status !== 'Cancelled').reduce((s, a) => s + a.fee, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Billing & Payments</h1>
          <p>Revenue overview — amounts in LKR</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRev),    icon: TrendingUp,   color: 'green'  },
          { label: 'Collected',     value: formatCurrency(totalRev),    icon: CheckCircle,  color: 'teal'   },
          { label: 'Outstanding',   value: formatCurrency(pendingRev),  icon: AlertCircle,  color: 'orange' },
          { label: 'Total Invoiced',value: formatCurrency(totalFees),   icon: Receipt,      color: 'blue'   },
        ].map(s => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <div className="stat-icon"><s.icon size={22} /></div>
            <div className="stat-info">
              <div className="stat-value" style={{ fontSize: 16 }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Paid */}
        <div className="card">
          <h3 style={{ color: 'var(--green)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={16} /> Collected Payments ({paid.length})
          </h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Apt ID</th><th>Client</th><th>Date</th><th>Type</th><th>Amount</th></tr></thead>
              <tbody>
                {paid.map(a => (
                  <tr key={a.id}>
                    <td>{a.appointmentId}</td>
                    <td>{a.clientName}</td>
                    <td>{formatDate(a.date)}</td>
                    <td>{a.type}</td>
                    <td style={{ color: 'var(--green)', fontWeight: 600 }}>{formatCurrency(a.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unpaid */}
        <div className="card">
          <h3 style={{ color: 'var(--orange)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={16} /> Pending Payments ({unpaid.length})
          </h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Apt ID</th><th>Client</th><th>Date</th><th>Type</th><th>Amount</th></tr></thead>
              <tbody>
                {unpaid.map(a => (
                  <tr key={a.id}>
                    <td>{a.appointmentId}</td>
                    <td>{a.clientName}</td>
                    <td>{formatDate(a.date)}</td>
                    <td>{a.type}</td>
                    <td style={{ color: 'var(--orange)', fontWeight: 600 }}>{formatCurrency(a.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;

