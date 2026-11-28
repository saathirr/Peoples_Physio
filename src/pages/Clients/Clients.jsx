import React, { useState } from 'react';
import PageWrapper from '../../components/UI/PageWrapper';
import { useApp } from '../../context/AppContext';
import { formatDate, formatPhone, calcAge, formatCurrency } from '../../utils/format';
import { DISTRICTS, GENDERS, CLIENT_STATUS } from '../../utils/data';
import {
  UserPlus, Search, Edit2, Trash2, Eye, Users, X, ChevronDown
} from 'lucide-react';
import Modal from '../../components/UI/Modal';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import './Clients.css';

const emptyClient = {
  firstName: '', lastName: '', nic: '', dob: '',
  gender: 'Male', phone: '', email: '', address: '',
  district: 'Colombo', referredBy: '', condition: '',
  conditionHistory: '', notes: '', status: 'Active',
};

/* ── Registration / Edit Form ── */
const ClientForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptyClient, ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone) {
      alert('Please fill First Name, Last Name, and Phone.');
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section-title">Personal Information</div>
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input className="form-control" value={form.firstName}
            onChange={e => set('firstName', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input className="form-control" value={form.lastName}
            onChange={e => set('lastName', e.target.value)} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>NIC Number</label>
          <input className="form-control" value={form.nic}
            onChange={e => set('nic', e.target.value)}
            placeholder="199012345678 or 900234567V" />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input className="form-control" type="date" value={form.dob}
            onChange={e => set('dob', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Gender</label>
          <select className="form-control" value={form.gender}
            onChange={e => set('gender', e.target.value)}>
            {GENDERS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Contact Number *</label>
          <input className="form-control" value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="077 123 4567" required />
        </div>
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input className="form-control" type="email" value={form.email}
          onChange={e => set('email', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input className="form-control" value={form.address}
          onChange={e => set('address', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>District</label>
          <select className="form-control" value={form.district}
            onChange={e => set('district', e.target.value)}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Referred By</label>
          <input className="form-control" value={form.referredBy}
            onChange={e => set('referredBy', e.target.value)}
            placeholder="Doctor name or Self" />
        </div>
      </div>

      <div className="form-section-title" style={{ marginTop: 6 }}>Medical Information</div>
      <div className="form-group">
        <label>Main Condition / Diagnosis</label>
        <input className="form-control" value={form.condition}
          onChange={e => set('condition', e.target.value)}
          placeholder="e.g. Lower Back Pain, Knee Injury" />
      </div>
      <div className="form-group">
        <label>Condition History / Description</label>
        <textarea className="form-control" rows={4} value={form.conditionHistory}
          onChange={e => set('conditionHistory', e.target.value)}
          placeholder="Describe the client's issue in detail — onset, severity, previous treatments, relevant medical history..." />
      </div>
      <div className="form-group">
        <label>Additional Notes</label>
        <textarea className="form-control" rows={2} value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Any extra notes for this client" />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select className="form-control" value={form.status}
          onChange={e => set('status', e.target.value)}>
          {CLIENT_STATUS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">
          <UserPlus size={14} /> {initial?.firstName ? 'Update Client' : 'Register Client'}
        </button>
      </div>
    </form>
  );
};

/* ── Client Detail View ── */
const ClientDetail = ({ client, onClose, onEdit, appointments, sales }) => {
  const clientApts  = appointments.filter(a => a.clientId === client.clientId)
    .sort((a,b) => b.date.localeCompare(a.date));
  const clientSales = sales.filter(s => s.clientId === client.clientId)
    .sort((a,b) => b.date.localeCompare(a.date));
  const totalSpent  = clientSales.reduce((sum, s) => sum + Number(s.amount), 0);

  const statusColor = { Confirmed: 'badge-teal', Completed: 'badge-green', Pending: 'badge-orange', Cancelled: 'badge-red' };

  return (
    <>
      {/* Header */}
      <div className="client-detail-header">
        <div className="cd-avatar">{client.firstName[0]}{client.lastName[0]}</div>
        <div style={{ flex: 1 }}>
          <h3>{client.firstName} {client.lastName}</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <span className="client-id-badge">{client.clientId}</span>
            <span className={`badge ${client.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{client.status}</span>
            <span className="badge badge-gold">Total Paid: {formatCurrency(totalSpent)}</span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="cd-grid">
        <div className="cd-field"><span>NIC</span><strong>{client.nic || '—'}</strong></div>
        <div className="cd-field"><span>Age</span><strong>{calcAge(client.dob)} years</strong></div>
        <div className="cd-field"><span>Gender</span><strong>{client.gender}</strong></div>
        <div className="cd-field"><span>DOB</span><strong>{formatDate(client.dob)}</strong></div>
        <div className="cd-field"><span>Phone</span><strong>{formatPhone(client.phone)}</strong></div>
        <div className="cd-field"><span>Email</span><strong>{client.email || '—'}</strong></div>
        <div className="cd-field cd-full"><span>Address</span><strong>{client.address || '—'}</strong></div>
        <div className="cd-field"><span>District</span><strong>{client.district}</strong></div>
        <div className="cd-field"><span>Referred By</span><strong>{client.referredBy || '—'}</strong></div>
        <div className="cd-field"><span>Registered</span><strong>{formatDate(client.createdAt)}</strong></div>
        <div className="cd-field cd-full">
          <span>Condition / Diagnosis</span>
          <strong>{client.condition || '—'}</strong>
        </div>
        {client.conditionHistory && (
          <div className="cd-field cd-full cd-history">
            <span>Condition History / Description</span>
            <div className="cd-history-text">{client.conditionHistory}</div>
          </div>
        )}
        {client.notes && (
          <div className="cd-field cd-full">
            <span>Notes</span><strong>{client.notes}</strong>
          </div>
        )}
      </div>

      {/* Appointment History */}
      <div className="cd-section">
        <h4>Appointment History ({clientApts.length})</h4>
        {clientApts.length === 0 ? (
          <p className="cd-empty">No appointments yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Type</th><th>Therapist</th><th>Status</th><th>Fee</th></tr></thead>
              <tbody>
                {clientApts.map(a => (
                  <tr key={a.id}>
                    <td>{formatDate(a.date)}</td>
                    <td>{a.type}</td>
                    <td style={{ fontSize: 12 }}>{a.therapist}</td>
                    <td><span className={`badge ${statusColor[a.status] || 'badge-blue'}`}>{a.status}</span></td>
                    <td style={{ color: 'var(--teal)', fontWeight: 600 }}>LKR {a.fee?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="cd-section">
        <h4>Payment History ({clientSales.length}) — Total: {formatCurrency(totalSpent)}</h4>
        {clientSales.length === 0 ? (
          <p className="cd-empty">No payments recorded.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Session Type</th><th>Notes</th><th>Amount</th></tr></thead>
              <tbody>
                {clientSales.map(s => (
                  <tr key={s.id}>
                    <td>{formatDate(s.date)}</td>
                    <td>{s.sessionType}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{s.notes || '—'}</td>
                    <td><span style={{ color: 'var(--green)', fontWeight: 700 }}>{formatCurrency(s.amount)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-outline" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={onEdit}>Edit Client</button>
      </div>
    </>
  );
};

/* ── Main Page ── */
const Clients = () => {
  const { clients, appointments, sales, addClient, updateClient, deleteClient } = useApp();
  const [search,       setSearch]      = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modal,        setModal]       = useState(null);
  const [selected,     setSelected]    = useState(null);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q ||
      `${c.firstName} ${c.lastName} ${c.clientId} ${c.nic} ${c.phone} ${c.condition} ${c.conditionHistory}`
        .toLowerCase().includes(q);
    const matchS = filterStatus === 'All' || c.status === filterStatus;
    return matchQ && matchS;
  });

  const statusColor = { Active: 'badge-green', Inactive: 'badge-red' };

  return (
    <PageWrapper>
    <div>
      <div className="page-header">
        <div>
          <h1>Client Management</h1>
          <p>{clients.length} registered · {clients.filter(c => c.status === 'Active').length} active</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <UserPlus size={15} /> Register New Client
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filter-bar">
          <div className="search-bar">
            <Search size={15} color="var(--gray-400)" />
            <input
              placeholder="Search by name, ID, NIC, phone, condition..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn-icon" onClick={() => setSearch('')} style={{ padding: 2 }}>
                <X size={13} />
              </button>
            )}
          </div>
          <div className="filter-tabs">
            {['All', 'Active', 'Inactive'].map(s => (
              <button key={s}
                className={`filter-tab${filterStatus === s ? ' active' : ''}`}
                onClick={() => setFilterStatus(s)}>{s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          {filtered.length === 0 ? (
            <div className="empty-state"><Users /><p>No clients found</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>District</th>
                  <th>Condition</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><span className="client-id-badge">{c.clientId}</span></td>
                    <td>
                      <div className="name-cell">
                        <div className="name-avatar">{c.firstName[0]}{c.lastName[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</div>
                          {c.conditionHistory && (
                            <div style={{ fontSize: 10, color: 'var(--gray-400)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {c.conditionHistory}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{calcAge(c.dob)}</td>
                    <td>{c.gender}</td>
                    <td>{formatPhone(c.phone)}</td>
                    <td>{c.district}</td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.condition || '—'}
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td><span className={`badge ${statusColor[c.status]}`}>{c.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" title="View Details"
                          onClick={() => { setSelected(c); setModal('view'); }}>
                          <Eye size={15} />
                        </button>
                        <button className="btn-icon" title="Edit"
                          onClick={() => { setSelected(c); setModal('edit'); }}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-icon" title="Delete"
                          style={{ color: 'var(--red)' }}
                          onClick={() => { setSelected(c); setModal('delete'); }}>
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
        <div className="table-footer">
          Showing {filtered.length} of {clients.length} clients
        </div>
      </div>

      {/* Add */}
      {modal === 'add' && (
        <Modal title="Register New Client" onClose={() => setModal(null)} size="modal-lg">
          <ClientForm
            initial={{}}
            onSave={data => { addClient(data); setModal(null); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Edit */}
      {modal === 'edit' && selected && (
        <Modal title="Edit Client" onClose={() => setModal(null)} size="modal-lg">
          <ClientForm
            initial={selected}
            onSave={data => { updateClient(selected.id, data); setModal(null); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* View */}
      {modal === 'view' && selected && (
        <Modal title="Client Details" onClose={() => setModal(null)} size="modal-lg">
          <ClientDetail
            client={selected}
            appointments={appointments}
            sales={sales}
            onClose={() => setModal(null)}
            onEdit={() => setModal('edit')}
          />
        </Modal>
      )}

      {/* Delete */}
      {modal === 'delete' && selected && (
        <ConfirmDialog
          title="Delete Client"
          message={`Delete ${selected.firstName} ${selected.lastName} (${selected.clientId})? All their appointment records will also be removed.`}
          danger
          onConfirm={() => { deleteClient(selected.id); setModal(null); }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
    </PageWrapper>
  );
};

export default Clients;
