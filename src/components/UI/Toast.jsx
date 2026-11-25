import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const Toast = ({ toasts }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle size={16} />}
          {t.type === 'error'   && <XCircle size={16} />}
          {t.type === 'info'    && <Info size={16} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
};

export default Toast;

