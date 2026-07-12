import { createContext, useContext, useState, useCallback } from 'react';
import styles from './Common.module.css';

// ── BUTTON ────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
}

// ── INPUT ─────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.inputError : ''}`} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

// ── SELECT ────────────────────────────────────────────────
export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={`${styles.input} ${error ? styles.inputError : ''}`} {...props}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

// ── SPINNER ───────────────────────────────────────────────
export function Spinner({ size = 36 }) {
  return (
    <div className={styles.spinnerWrap}>
      <div className={styles.spinnerLg} style={{ width: size, height: size }} />
    </div>
  );
}

// ── MODAL ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{title}</span>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// ── BADGE ─────────────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  return <span className={`${styles.badge} ${styles[`badge_${variant}`]}`}>{children}</span>;
}

// ── EMPTY STATE ───────────────────────────────────────────
export function EmptyState({ icon = '📭', message = 'Nothing here yet', action }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>{icon}</div>
      <p className={styles.emptyMsg}>{message}</p>
      {action}
    </div>
  );
}

// ── TOAST CONTEXT ─────────────────────────────────────────
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastStack}>
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.type}`]}`}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToastCtx() {
  return useContext(ToastCtx);
}

// Note: PrivateRoute and AdminRoute live in their own files
// (./PrivateRoute.jsx and ./AdminRoute.jsx) to avoid circular imports.

// ── PAGINATION ────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >←</button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`${styles.pageBtn} ${page === i ? styles.pageActive : ''}`}
          onClick={() => onChange(i)}
        >{i + 1}</button>
      ))}
      <button
        className={styles.pageBtn}
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >→</button>
    </div>
  );
}
