import React, { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';

  return (
    <div 
      className={`toast show align-items-center text-white ${bgClass} border-0 position-fixed bottom-0 end-0 m-3`} 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
      style={{ zIndex: 1100 }}
    >
      <div className="d-flex">
        <div className="toast-body">
          {message}
        </div>
        <button 
          type="button" 
          className="btn-close btn-close-white me-2 m-auto" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}
