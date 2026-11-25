import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/format';
import { APPOINTMENT_TYPES } from '../../utils/data';
import {
  Plus, Search, Edit2, Trash2, Receipt,
  CheckCircle, TrendingUp, CalendarRange
} from 'lucide-react';
import Modal from '../../components/UI/Modal';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import './Sales.css';

const emptySale = {
  clientId: '', clientName: '', amount: '',
  date: new Date().toISOString().split('T')[0],
  sessionType: APPOINTMENT_TYPES[0], notes: '',
};

const SaleForm = ({ initial, clients, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptySale, ...initial });
  const [clientSearch, setClientSearch] = useState(initial?.clientName || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filteredClients = clients.filter(c =>
    `${c.firstName} ${c.lastName} ${c.clientId}`.toLowerCase().includes(clientSearch.toLowerCase())
  ).slice(0, 8);

  const selectClient = (c) => {
    setForm(f => ({ ...f, clientId: c.clientId, clientName: `${c.firstName} ${c.lastName}` }));
    setClientSearch(`${c.firstName} ${c.lastName}`);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName || !form.amount || !form.date) {
      alert('Please fill in Client, Amount and Date.');
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Client search */}
      <div className="form-group" style={{ position: 'relative' }}>
        <label>Client * <span style={{ color: 'var(--gray-400)', fontWeight: 400, textTransform: 'none' }}>— search by name or ID</span></label>
        <input
          className="form-control"
          placeholder="Type client name..."
          value={clientSearch}
          onChange={e => { setClientSearch(e.target.value); setShowDropdown(true); set('clientName', e.target.value); }}
          onFocus={() => setShowDropdown(true)}
          autoComplete="off"
          required
        />
        {showDropdown && clientSearch && filteredClients.length > 0 && (
          <div className="client-dropdown">
            {filteredClients.map(c => (
              <div key={c.id} className="client-dropdown-item" onMouseDown={() => selectClient(c)}>
                <div className="cdi-avatar">{c.firstName[0]}{c.lastName[0]}</div>
                <div>
                  <div className="cdi-name">{c.firstName} {c.lastName}</div>
                  <div className="cdi-meta">{c.clientId} · {c.condition || 'No condition'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date *</label>
          <input className="form-control" type="date" value={form.date}
            onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Amount (LKR) *</label>
          <input className="form-control" type="number" min="0" value={form.amount}
            onChange={e => set('amount', e.target.value)} placeholder="e.g. 3500" required />
        </div>
      </div>

      <div className="form-group">
        <label>Session Type</label>
        <select className="form-control" value={form.sessionType}
          onChange={e => set('sessionType', e.target.value)}>
          {APPOINTMENT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Notes / Description</label>
        <textarea className="form-control" rows={3} value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="e.g. Session 4 — lower back therapy, improvement noted" />
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">
          <CheckCircle size={14} /> Record Payment
        </button>
      </div>
    </form>
  );
};

const SALE_FILTERS = [
  { key: 'today',  label: 'Today'      },
  { key: 'week',   label: 'This Week'  },
  { key: 'month',  label: 'This Month' },
  { key: 'all',    label: 'All Time'   },
  { key: 'custom', label: 'Pick Date'  },
];

const Sales = () => {
  const { clients, sales, addSale, updateSale, deleteSale, getRevenue } = useApp();

  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd,   setCustomEnd]   = useState('');
  const [modal,       setModal]       = useState(null); // 'add' | 'edit' | 'delete'
  const [selected,    setSelected]    = useState(null);

  // Apply date filter
  const today = new Date(); today.setHours(0,0,0,0);
  const inFilter = (s) => {
    const d = new Date(s.date); d.setHours(0,0,0,0);
    if (filter === 'today') return d.getTime() === today.getTime();
    if (filter === 'week') {
      const ws = new Date(today); ws.setDate(today.getDate() - today.getDay());
      return d >= ws && d <= today;
    }
    if (filter === 'month') return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    if (filter === 'custom' && customStart && customEnd) {
      const s2 = new Date(customStart); s2.setHours(0,0,0,0);
      const e2 = new Date(customEnd);   e2.setHours(23,59,59,999);
      return d >= s2 && d <= e2;
    }
    return true;
  };

  const filtered = sales
    .filter(s => inFilter(s))
    .filter(s => {
      const q = search.toLowerCase();
      return !q || `${s.clientName} ${s.saleId} ${s.sessionType} ${s.notes}`.toLowerCase().includes(q);
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const filteredTotal = filtered.reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Sales & Payments</h1>
          <p>{sales.length} total payment records · All amounts in LKR</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Plus size={15} /> Record Payment
        </button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="sales-summary">
        {[
          { label: 'Today',      value: getRevenue('today') },
          { label: 'This Week',  value: getRevenue('week')  },
          { label: 'This Month', value: getRevenue('month') },
          { label: 'All Time',   value: getRevenue('all')   },
        ].map(r => (
          <div key={r.label} className="summary-card">
            <div className="summary-label">{r.label}</div>
            <div className="summary-value">{formatCurrency(r.value)}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filter-bar" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="search-bar">
            <Search size={15} color="var(--gray-400)" />
            <input placeholder="Search by client, type, notes..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="filter-tabs">
            {SALE_FILTERS.map(f => (
              <button key={f.key}
                className={`filter-tab${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}>
                {f.key === 'custom' && <CalendarRange size={12} />} {f.label}
              </button>
            ))}
          </div>

          {filter === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="date" className="form-control" style={{ width: 150 }}
                value={customStart} onChange={e => setCustomStart(e.target.value)} />
              <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>to</span>
              <input type="date" className="form-control" style={{ width: 150 }}
                value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
            Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="total-row">
            <TrendingUp size={15} />
            Filtered Total: <strong>{formatCurrency(filteredTotal)}</strong>
          </div>
        </div>
        <div className="table-container">
          {filtered.length === 0 ? (
            <div className="empty-state"><Receipt /><p>No payment records found</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Session Type</th>
                  <th>Notes</th>
                  <th>Amount (LKR)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td><span className="client-id-badge">{s.saleId}</span></td>
                    <td>
                      <div className="name-cell">
                        <div className="name-avatar">{s.clientName.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.clientName}</div>
                          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.clientId}</div>
                        </div>
                      </div>
                    </td>
                    <td>{formatDate(s.date)}</td>
                    <td>{s.sessionType}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-500)' }}>
                      {s.notes || '—'}
                    </td>
                    <td>
                      <span className="amount-badge">{formatCurrency(s.amount)}</span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" title="Edit"
                          onClick={() => { setSelected(s); setModal('edit'); }}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-icon" title="Delete"
                          style={{ color: 'var(--red)' }}
                          onClick={() => { setSelected(s); setModal('delete'); }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add */}
      {modal === 'add' && (
        <Modal title="Record Payment" onClose={() => setModal(null)} size="modal-lg">
          <SaleForm
            clients={clients}
            initial={{}}
            onSave={d => { addSale(d); setModal(null); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Edit */}
      {modal === 'edit' && selected && (
        <Modal title="Edit Payment Record" onClose={() => setModal(null)} size="modal-lg">
          <SaleForm
            clients={clients}
            initial={selected}
            onSave={d => { updateSale(selected.id, d); setModal(null); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete */}
      {modal === 'delete' && selected && (
        <ConfirmDialog
          title="Delete Payment Record"
          message={`Delete payment ${selected.saleId} of ${formatCurrency(selected.amount)} for ${selected.clientName}? This will affect your revenue totals.`}
          danger
          onConfirm={() => { deleteSale(selected.id); setModal(null); }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Sales;

