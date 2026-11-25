import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatTime, formatCurrency } from '../../utils/format';
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const statusColor = {
  Confirmed: '#1A6B72', Completed: '#10B981', Pending: '#F59E0B',
  Cancelled: '#EF4444', 'No-Show': '#EF4444'
};

const Schedule = () => {
  const { appointments, clients } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = currentDate.toISOString().split('T')[0];
  const dateLabel = currentDate.toLocaleDateString('en-LK', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  const dayApts = appointments
    .filter(a => a.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const prevDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const nextDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };
  const goToday = () => setCurrentDate(new Date());

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am–7pm

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Daily Schedule</h1>
          <p>{dateLabel}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={prevDay}><ChevronLeft size={15} /></button>
          <button className="btn btn-outline btn-sm" onClick={goToday}>Today</button>
          <button className="btn btn-outline" onClick={nextDay}><ChevronRight size={15} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Timeline */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--teal-dark)' }}>
            <CalendarDays size={16} style={{ display: 'inline', marginRight: 6 }} />
            {dayApts.length} appointment{dayApts.length !== 1 ? 's' : ''} today
          </h3>
          <div className="timeline">
            {hours.map(h => {
              const timeKey = `${String(h).padStart(2,'0')}:00`;
              const slotApts = dayApts.filter(a => parseInt(a.time.split(':')[0]) === h);
              return (
                <div key={h} className="timeline-row">
                  <div className="timeline-hour">{h > 12 ? `${h-12}:00 PM` : `${h === 12 ? '12' : h}:00 ${h < 12 ? 'AM' : 'PM'}`}</div>
                  <div className="timeline-slot">
                    {slotApts.map(a => (
                      <div key={a.id} className="timeline-apt" style={{ borderLeftColor: statusColor[a.status] }}>
                        <div className="ta-name">{a.clientName}</div>
                        <div className="ta-meta">{a.type} · {a.duration} min · {a.therapist}</div>
                        <div className="ta-fee">{formatCurrency(a.fee)} · <span style={{ color: statusColor[a.status] }}>{a.status}</span></div>
                      </div>
                    ))}
                    {slotApts.length === 0 && <div className="timeline-empty" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <h3 style={{ marginBottom: 14, color: 'var(--teal-dark)', fontSize: 14 }}>Day Summary</h3>
            {[
              { label: 'Total Appointments', value: dayApts.length },
              { label: 'Confirmed',          value: dayApts.filter(a => a.status === 'Confirmed').length },
              { label: 'Completed',          value: dayApts.filter(a => a.status === 'Completed').length },
              { label: 'Pending',            value: dayApts.filter(a => a.status === 'Pending').length },
              { label: 'Revenue (Expected)', value: formatCurrency(dayApts.filter(a => a.status !== 'Cancelled').reduce((s,a) => s+a.fee, 0)) },
              { label: 'Revenue (Collected)',value: formatCurrency(dayApts.filter(a => a.paid).reduce((s,a) => s+a.fee, 0)) },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 13 }}>
                <span style={{ color: 'var(--gray-500)' }}>{r.label}</span>
                <strong>{r.value}</strong>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 12, color: 'var(--teal-dark)', fontSize: 14 }}>Appointment List</h3>
            {dayApts.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>No appointments</p>
            ) : dayApts.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 12, minWidth: 50 }}>{formatTime(a.time)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.clientName}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{a.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;

