import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, onClose, children, footer, size = '' }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal ${size}`}>
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="btn-icon" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

export default Modal;

