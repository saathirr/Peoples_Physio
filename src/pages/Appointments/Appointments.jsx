import React, { useState } from 'react';
import PageWrapper from '../../components/UI/PageWrapper';
import { useApp } from '../../context/AppContext';
import { formatDate, formatTime, formatCurrency } from '../../utils/format';
import { THERAPISTS, APPOINTMENT_TYPES, APPOINTMENT_STATUS } from '../../utils/data';
import {
  Plus, Search, Edit2, Trash2, Eye, CalendarDays,
  CheckCircle, Clock, XCircle, Filter
} from 'lucide-react';
import Modal from '../../components/UI/Modal';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import './Appointments.css';

const statusColor = {
  Confirmed: 'badge-teal', Completed: 'badge-green',
  Pending: 'badge-orange', Cancelled: 'badge-red', 'No-Show': 'badge-red'
};

const emptyApt = {
  clientId: '', clientName: '', therapist: THERAPISTS[0],
  date: '', time: '09:00', duration: 60, type: APPOINTMENT_TYPES[0],
  status: 'Confirmed', fee: 3500, paid: false, notes: '',
};

const AppointmentForm = ({ initial, clients, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptyApt, ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleClientChange = (e) => {
    const c = clients.find(x => x.id === e.target.value);
    if (c) set('clientId', c.clientId);
    setForm(f => ({
      ...f,
      clientId: c?.clientId || '',
      clientName: c ? `${c.firstName} ${c.lastName}` : '',
      _clientRef: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName || !form.date) return alert('Please fill required fields.');
    onSave(form);
  };

  const selectedClientId = clients.find(c => c.clientId === form.clientId)?.id || form._clientRef || '';

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Client *</label>
          <select className="form-control" value={selectedClientId} onChange={handleClientChange} required>
            <option value="">— Select Client —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.clientId})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Therapist</label>
          <select className="form-control" value={form.therapist} onChange={e => set('therapist', e.target.value)}>
            {THERAPISTS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Date *</label>
          <input className="form-control" type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input className="form-control" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Session Type</label>
          <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
            {APPOINTMENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Duration (mins)</label>
          <select className="form-control" value={form.duration} onChange={e => set('duration', Number(e.target.value))}>
            {[15,30,45,60,90,120].map(d => <option key={d} value={d}>{d} min</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
            {APPOINTMENT_STATUS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Fee (LKR)</label>
          <input className="form-control" type="number" value={form.fee} onChange={e => set('fee', Number(e.target.value))} min={0} />
        </div>
      </div>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.paid} onChange={e => set('paid', e.target.checked)} />
          Payment Received
        </label>
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea className="form-control" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Appointment</button>
      </div>
    </form>
  );
};

const AptDetail = ({ apt, onClose, onEdit }) => (
  <>
    <div className="apt-detail-header">
      <div className={`apt-status-icon status-${apt.status.toLowerCase()}`}>
        {apt.status === 'Completed' && <CheckCircle size={24} />}
        {apt.status === 'Confirmed' && <Clock size={24} />}
        {apt.status === 'Cancelled' && <XCircle size={24} />}
        {apt.status === 'Pending'   && <Clock size={24} />}
      </div>
      <div>
        <h3>{apt.appointmentId}</h3>
        <span className={`badge ${statusColor[apt.status]}`}>{apt.status}</span>
      </div>
    </div>
    <div className="cd-grid">
      <div className="cd-field"><span>Client</span><strong>{apt.clientName}</strong></div>
      <div className="cd-field"><span>Client ID</span><strong>{apt.clientId}</strong></div>
      <div className="cd-field"><span>Date</span><strong>{formatDate(apt.date)}</strong></div>
      <div className="cd-field"><span>Time</span><strong>{formatTime(apt.time)}</strong></div>
      <div className="cd-field"><span>Duration</span><strong>{apt.duration} minutes</strong></div>
      <div className="cd-field"><span>Type</span><strong>{apt.type}</strong></div>
      <div className="cd-field cd-full"><span>Therapist</span><strong>{apt.therapist}</strong></div>
      <div className="cd-field"><span>Fee</span><strong>{formatCurrency(apt.fee)}</strong></div>
      <div className="cd-field"><span>Payment</span>
        <strong><span className={`badge ${apt.paid ? 'badge-green' : 'badge-red'}`}>{apt.paid ? 'Paid' : 'Pending'}</span></strong>
      </div>
      {apt.notes && <div className="cd-field cd-full"><span>Notes</span><strong>{apt.notes}</strong></div>}
    </div>
    <div className="modal-footer">
      <button className="btn btn-outline" onClick={onClose}>Close</button>
      <button className="btn btn-primary" onClick={onEdit}>Edit</button>
    </div>
  </>
);

const Appointments = () => {
  const { clients, appointments, addAppointment, updateAppointment, deleteAppointment } = useApp();
  const [search, setSearch]     = useState('');
  const [filterStatus, setStatus] = useState('All');
  const [filterDate, setDate]   = useState('');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || `${a.clientName} ${a.appointmentId} ${a.therapist} ${a.type}`.toLowerCase().includes(q);
    const matchS = filterStatus === 'All' || a.status === filterStatus;
    const matchD = !filterDate || a.date === filterDate;
    return matchQ && matchS && matchD;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  return (
    <PageWrapper>
    <div>
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>{appointments.length} total appointments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Plus size={15} /> New Appointment
        </button>
      </div>

      {/* Quick Stats */}
      <div className="apt-quick-stats">
        {APPOINTMENT_STATUS.map(s => (
          <div key={s} className={`qs-card qs-${s.toLowerCase().replace('-','')}`} onClick={() => setStatus(s === filterStatus ? 'All' : s)}>
            <span className="qs-count">{appointments.filter(a => a.status === s).length}</span>
            <span className="qs-label">{s}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filter-bar" style={{ flexWrap: 'wrap' }}>
          <div className="search-bar">
            <Search size={15} color="var(--gray-400)" />
            <input placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarDays size={15} color="var(--gray-400)" />
            <input type="date" className="form-control" style={{ width: 'auto' }} value={filterDate} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="filter-tabs">
            <button className={`filter-tab${filterStatus === 'All' ? ' active' : ''}`} onClick={() => setStatus('All')}>All</button>
            {APPOINTMENT_STATUS.map(s => (
              <button key={s} className={`filter-tab${filterStatus === s ? ' active' : ''}`} onClick={() => setStatus(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          {filtered.length === 0 ? (
            <div className="empty-state"><CalendarDays /><p>No appointments found</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Apt ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Therapist</th>
                  <th>Duration</th>
                  <th>Fee</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td><span className="client-id-badge">{a.appointmentId}</span></td>
                    <td>
                      <div className="name-cell">
                        <div className="name-avatar" style={{ fontSize: 9 }}>
                          {a.clientName.split(' ').map(w => w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{a.clientName}</div>
                          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{a.clientId}</div>
                        </div>
                      </div>
                    </td>
                    <td>{formatDate(a.date)}</td>
                    <td>{formatTime(a.time)}</td>
                    <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.type}</td>
                    <td style={{ fontSize: 12 }}>{a.therapist.replace('Dr. ', 'Dr.')}</td>
                    <td>{a.duration} min</td>
                    <td style={{ color: 'var(--teal)', fontWeight: 600 }}>{formatCurrency(a.fee)}</td>
                    <td><span className={`badge ${a.paid ? 'badge-green' : 'badge-orange'}`}>{a.paid ? 'Paid' : 'Pending'}</span></td>
                    <td><span className={`badge ${statusColor[a.status] || 'badge-blue'}`}>{a.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" onClick={() => { setSelected(a); setModal('view'); }}><Eye size={15} /></button>
                        <button className="btn-icon" onClick={() => { setSelected(a); setModal('edit'); }}><Edit2 size={15} /></button>
                        <button className="btn-icon" style={{ color: 'var(--red)' }} onClick={() => { setSelected(a); setModal('delete'); }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="table-footer">Showing {filtered.length} of {appointments.length} appointments</div>
      </div>

      {/* Add */}
      {modal === 'add' && (
        <Modal title="New Appointment" onClose={() => setModal(null)} size="modal-lg">
          <AppointmentForm clients={clients} initial={{}} onSave={d => { addAppointment(d); setModal(null); }} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* Edit */}
      {modal === 'edit' && selected && (
        <Modal title="Edit Appointment" onClose={() => setModal(null)} size="modal-lg">
          <AppointmentForm clients={clients} initial={selected} onSave={d => { updateAppointment(selected.id, d); setModal(null); }} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* View */}
      {modal === 'view' && selected && (
        <Modal title="Appointment Details" onClose={() => setModal(null)} size="modal-lg">
          <AptDetail apt={selected} onClose={() => setModal(null)} onEdit={() => setModal('edit')} />
        </Modal>
      )}

      {/* Delete */}
      {modal === 'delete' && selected && (
        <ConfirmDialog
          title="Cancel Appointment"
          message={`Delete appointment ${selected.appointmentId} for ${selected.clientName}?`}
          danger
          onConfirm={() => { deleteAppointment(selected.id); setModal(null); }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
    </PageWrapper>
  );
};

export default Appointments;

