import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, danger }) => (
  <Modal
    title={title || 'Confirm'}
    onClose={onCancel}
    footer={
      <>
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
          {danger ? 'Delete' : 'Confirm'}
        </button>
      </>
    }
  >
    <div className="confirm-dialog">
      <p>{message || 'Are you sure you want to proceed?'}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;

