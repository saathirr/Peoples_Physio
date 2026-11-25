import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { THERAPISTS } from '../../utils/data';
import { Save, Building, User, Phone, Mail, MapPin } from 'lucide-react';

const Settings = () => {
  const { showToast } = useApp();
  const [clinic, setClinic] = useState({
    name: "People's Physio",
    tagline: 'Your Health, Our Priority',
    phone: '+94 77 123 4567',
    email: 'info@peoplesphysio.lk',
    address: 'No. 25, Galle Road, Colombo 06, Sri Lanka',
    regNo: 'PHY/SL/2020/001',
    openTime: '08:00',
    closeTime: '18:00',
    currency: 'LKR',
    dateFormat: 'DD/MM/YYYY',
  });

  const save = () => showToast('Settings saved successfully!');

  return (
    <div>
      <div className="page-header">
        <div><h1>Settings</h1><p>Manage clinic and system settings</p></div>
        <button className="btn btn-primary" onClick={save}><Save size={15} /> Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Clinic Info */}
        <div className="card">
          <h3 style={{ color: 'var(--teal)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Building size={16} /> Clinic Information
          </h3>
          <div className="form-group"><label>Clinic Name</label>
            <input className="form-control" value={clinic.name} onChange={e => setClinic(c => ({...c, name: e.target.value}))} /></div>
          <div className="form-group"><label>Tagline</label>
            <input className="form-control" value={clinic.tagline} onChange={e => setClinic(c => ({...c, tagline: e.target.value}))} /></div>
          <div className="form-group"><label>Registration No.</label>
            <input className="form-control" value={clinic.regNo} onChange={e => setClinic(c => ({...c, regNo: e.target.value}))} /></div>
          <div className="form-group"><label>Phone</label>
            <input className="form-control" value={clinic.phone} onChange={e => setClinic(c => ({...c, phone: e.target.value}))} /></div>
          <div className="form-group"><label>Email</label>
            <input className="form-control" type="email" value={clinic.email} onChange={e => setClinic(c => ({...c, email: e.target.value}))} /></div>
          <div className="form-group"><label>Address</label>
            <textarea className="form-control" rows={2} value={clinic.address} onChange={e => setClinic(c => ({...c, address: e.target.value}))} /></div>
        </div>

        {/* System Settings */}
        <div className="card">
          <h3 style={{ color: 'var(--teal)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={16} /> System Settings
          </h3>
          <div className="form-row">
            <div className="form-group"><label>Opening Time</label>
              <input className="form-control" type="time" value={clinic.openTime} onChange={e => setClinic(c => ({...c, openTime: e.target.value}))} /></div>
            <div className="form-group"><label>Closing Time</label>
              <input className="form-control" type="time" value={clinic.closeTime} onChange={e => setClinic(c => ({...c, closeTime: e.target.value}))} /></div>
          </div>
          <div className="form-group"><label>Currency</label>
            <select className="form-control" value={clinic.currency} onChange={e => setClinic(c => ({...c, currency: e.target.value}))}>
              <option value="LKR">LKR — Sri Lankan Rupee</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>
          <div className="form-group"><label>Date Format</label>
            <select className="form-control" value={clinic.dateFormat} onChange={e => setClinic(c => ({...c, dateFormat: e.target.value}))}>
              <option value="DD/MM/YYYY">DD/MM/YYYY (Sri Lankan)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div style={{ padding: '14px', background: 'var(--teal-light)', borderRadius: 8, marginTop: 12, border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--teal)', marginBottom: 6 }}>Registered Therapists</div>
            {THERAPISTS.map(t => (
              <div key={t} style={{ padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-main)' }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
