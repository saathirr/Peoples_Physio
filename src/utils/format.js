// Sri Lankan formatting utilities

// Date: DD/MM/YYYY (Sri Lankan standard)
export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Date with time: DD/MM/YYYY HH:MM
export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const day    = String(d.getDate()).padStart(2, '0');
  const month  = String(d.getMonth() + 1).padStart(2, '0');
  const year   = d.getFullYear();
  const hours  = String(d.getHours()).padStart(2, '0');
  const mins   = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${mins}`;
};

// Time only: HH:MM
export const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
};

// Currency: LKR format (Sri Lankan Rupees)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'LKR 0.00';
  return `LKR ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Sri Lanka phone: +94 format
export const formatPhone = (phone) => {
  if (!phone) return '—';
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('94') && digits.length === 11) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10 && digits.startsWith('0')) {
    return `+94 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
};

// NIC validation (Sri Lanka)
export const isValidNIC = (nic) => {
  if (!nic) return false;
  // Old format: 9 digits + V or X
  const oldNIC = /^[0-9]{9}[VvXx]$/;
  // New format: 12 digits
  const newNIC = /^[0-9]{12}$/;
  return oldNIC.test(nic) || newNIC.test(nic);
};

// Today in YYYY-MM-DD (for input[type=date] value)
export const todayISO = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// Generate a simple ID
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Age from DOB
export const calcAge = (dob) => {
  if (!dob) return '—';
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// Day name
export const dayName = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-LK', { weekday: 'long' });
};

// Month name short
export const monthShort = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-LK', { month: 'short' });
};

