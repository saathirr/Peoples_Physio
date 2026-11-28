import React, { createContext, useContext, useState, useCallback } from 'react';
import { defaultClients, defaultAppointments } from '../utils/data';
import { generateId } from '../utils/format';

const AppContext = createContext(null);

// Default sales entries (linked to completed appointments)
const defaultSales = [
  {
    id: generateId(),
    saleId: 'SAL-001',
    clientId: 'PP-001',
    clientName: 'Kamal Perera',
    amount: 3500,
    date: '2025-11-20',
    sessionType: 'Physiotherapy Session',
    notes: 'Lower back exercise program – session 3',
    appointmentId: 'APT-005',
  },
  {
    id: generateId(),
    saleId: 'SAL-002',
    clientId: 'PP-005',
    clientName: 'Ruwan Dissanayake',
    amount: 2000,
    date: '2025-11-21',
    sessionType: 'Follow-up',
    notes: 'Ankle progress check',
    appointmentId: 'APT-004',
  },
  {
    id: generateId(),
    saleId: 'SAL-003',
    clientId: 'PP-002',
    clientName: 'Priya Jayasinghe',
    amount: 5000,
    date: '2025-11-22',
    sessionType: 'Assessment',
    notes: 'Initial knee assessment',
    appointmentId: '',
  },
];

export const AppProvider = ({ children }) => {
  const [clients, setClients] = useState(defaultClients);
  const [appointments, setAppointments] = useState(defaultAppointments);
  const [sales, setSales] = useState(defaultSales);
  const [toasts, setToasts] = useState([]);

  // ── Toast ─────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'success') => {
    const id = generateId();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  // ── CLIENTS ───────────────────────────────────────────────────────────
  const addClient = (data) => {
    const next = clients.length + 1;
    const clientId = `PP-${String(next).padStart(3, '0')}`;
    setClients(prev => [
      ...prev,
      { ...data, id: generateId(), clientId, createdAt: new Date().toISOString().split('T')[0] },
    ]);
    showToast('Client registered successfully!');
  };

  const updateClient = (id, data) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast('Client updated!');
  };

  const deleteClient = (id) => {
    const c = clients.find(x => x.id === id);
    setClients(prev => prev.filter(x => x.id !== id));
    setAppointments(prev => prev.filter(a => a.clientId !== c?.clientId));
    showToast('Client deleted.', 'error');
  };

  const getClient = (id) => clients.find(c => c.id === id);
  const getClientByClientId = (cid) => clients.find(c => c.clientId === cid);

  // ── APPOINTMENTS ──────────────────────────────────────────────────────
  const addAppointment = (data) => {
    const next = appointments.length + 1;
    const appointmentId = `APT-${String(next).padStart(3, '0')}`;
    setAppointments(prev => [...prev, { ...data, id: generateId(), appointmentId }]);
    showToast('Appointment booked!');
  };

  const updateAppointment = (id, data) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('Appointment updated!');
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    showToast('Appointment removed.', 'error');
  };

  // ── SALES ─────────────────────────────────────────────────────────────
  const addSale = (data) => {
    const next = sales.length + 1;
    const saleId = `SAL-${String(next).padStart(3, '0')}`;
    setSales(prev => [...prev, { ...data, id: generateId(), saleId }]);
    showToast(`Payment of LKR ${Number(data.amount).toLocaleString()} recorded!`);
  };

  const updateSale = (id, data) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    showToast('Sale record updated!');
  };

  const deleteSale = (id) => {
    setSales(prev => prev.filter(s => s.id !== id));
    showToast('Sale record deleted.', 'error');
  };

  // ── Revenue helpers ───────────────────────────────────────────────────
  const getRevenue = (filter = 'all', customStart = '', customEnd = '') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(s => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      if (filter === 'today') return d.getTime() === today.getTime();
      if (filter === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return d >= weekStart && d <= today;
      }
      if (filter === 'month') {
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      }
      if (filter === 'custom' && customStart && customEnd) {
        const s = new Date(customStart); s.setHours(0, 0, 0, 0);
        const e = new Date(customEnd); e.setHours(23, 59, 59, 999);
        return d >= s && d <= e;
      }
      return true; // 'all'
    }).reduce((sum, s) => sum + Number(s.amount), 0);
  };

  // ── Computed stats ────────────────────────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'Active').length,
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter(a => a.date === todayStr).length,
    confirmedAppointments: appointments.filter(a => a.status === 'Confirmed').length,
    completedSessions: appointments.filter(a => a.status === 'Completed').length,
    pendingAppointments: appointments.filter(a => a.status === 'Pending').length,
    cancelledAppointments: appointments.filter(a => a.status === 'Cancelled').length,
    totalRevenue: sales.reduce((s, x) => s + Number(x.amount), 0),
    pendingRevenue: appointments
      .filter(a => !a.paid && a.status !== 'Cancelled')
      .reduce((s, a) => s + (a.fee || 0), 0),
    totalSales: sales.length,
  };

  return (
    <AppContext.Provider value={{
      clients, appointments, sales, stats, toasts,
      addClient, updateClient, deleteClient, getClient, getClientByClientId,
      addAppointment, updateAppointment, deleteAppointment,
      addSale, updateSale, deleteSale, getRevenue,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
