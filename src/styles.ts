/** Shared auth modal styles - include in host app. Uses mobius-design token fallbacks when available. */

export const AUTH_STYLES = `
.mobius-auth-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}
.mobius-auth-overlay.open { display: flex; }
.mobius-auth-panel {
  background: var(--mobius-bg-primary, #fafbfc);
  border-radius: var(--mobius-radius-md, 12px);
  padding: 1.5rem;
  max-width: 360px;
  width: 90%;
  box-shadow: var(--mobius-shadow-lg, 0 8px 24px rgba(0,0,0,0.08));
  position: relative;
}
.mobius-auth-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--mobius-text-muted, #64748b);
  line-height: 1;
  padding: 0;
}
.mobius-auth-close:hover { color: var(--mobius-text-primary, #1a1d21); }
.mobius-auth-title { margin: 0 0 1rem; font-size: var(--mobius-text-lg, 1.125rem); }
.mobius-auth-form input,
.mobius-auth-form .mobius-auth-btn {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: var(--mobius-text-base, 0.9375rem);
  border: 1px solid var(--mobius-border, #e2e8f0);
  border-radius: var(--mobius-radius-base, 8px);
}
.mobius-auth-form .mobius-auth-btn {
  background: var(--mobius-accent, #3b82f6);
  color: var(--mobius-accent-text, white);
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.mobius-auth-form .mobius-auth-btn:hover { background: var(--mobius-accent-hover, #2563eb); }
.mobius-auth-error { font-size: var(--mobius-text-sm, 0.8125rem); color: var(--mobius-error, #dc2626); margin-top: 0.5rem; }
.mobius-auth-divider {
  display: flex;
  align-items: center;
  margin: 12px 0 10px;
}
.mobius-auth-divider::before,
.mobius-auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(0,0,0,0.1);
}
.mobius-auth-divider span {
  padding: 0 8px;
  font-size: var(--mobius-text-xs, 0.7rem);
  color: #94a3b8;
}
.mobius-auth-oauth {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.mobius-auth-oauth-btn,
.mobius-auth-sso-btn {
  flex: 1;
  padding: 8px;
  background: white;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: var(--mobius-radius-sm, 6px);
  font-size: var(--mobius-text-xs, 0.7rem);
  cursor: pointer;
}
.mobius-auth-switch {
  margin: 1rem 0 0;
  font-size: var(--mobius-text-sm, 0.8125rem);
  color: var(--mobius-text-muted, #64748b);
}
.mobius-auth-switch-btn {
  background: none;
  border: none;
  color: var(--mobius-accent, #3b82f6);
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}
.mobius-auth-switch-btn:hover { text-decoration: underline; }
.mobius-auth-user-info { margin: 0 0 1rem; font-size: var(--mobius-text-sm, 0.8125rem); }
.mobius-auth-prefs-link {
  display: block;
  margin-bottom: 1rem;
  color: var(--mobius-accent, #3b82f6);
  font-size: var(--mobius-text-sm, 0.8125rem);
}

/* Welcome panel (post-signup) */
.mobius-auth-welcome { text-align: center; padding: 0.5rem 0 0; }
.mobius-auth-welcome-emoji { font-size: 2rem; margin-bottom: 0.5rem; }
.mobius-auth-welcome-body {
  margin: 0 0 1rem;
  font-size: var(--mobius-text-sm, 0.8125rem);
  color: var(--mobius-text-muted, #64748b);
  line-height: 1.5;
}

/* Inline confirm (logout, etc.) */
.mobius-auth-confirm {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: var(--mobius-bg-muted, #f3f4f6);
  border: 1px solid var(--mobius-border, #e2e8f0);
  border-radius: var(--mobius-radius-base, 8px);
}
.mobius-auth-confirm-text {
  margin: 0 0 0.75rem;
  font-size: var(--mobius-text-sm, 0.8125rem);
}
.mobius-auth-confirm-actions { display: flex; gap: 8px; }
.mobius-auth-confirm-actions .mobius-auth-btn { margin: 0; flex: 1; }
.mobius-auth-confirm-actions .mobius-auth-btn-secondary {
  background: white;
  color: var(--mobius-text-primary, #1a1d21);
  border: 1px solid var(--mobius-border, #e2e8f0);
}
.mobius-auth-confirm-actions .mobius-auth-btn-danger {
  background: var(--mobius-error, #dc2626);
}
.mobius-auth-confirm-actions .mobius-auth-btn-danger:hover {
  background: var(--mobius-error-hover, #b91c1c);
}

/* Toasts */
.mobius-auth-toast-host {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1100;
  pointer-events: none;
}
.mobius-auth-toast {
  pointer-events: auto;
  min-width: 220px;
  max-width: 320px;
  padding: 10px 14px;
  border-radius: var(--mobius-radius-base, 8px);
  background: var(--mobius-bg-primary, #1a1d21);
  color: var(--mobius-bg-inverse-text, #fafbfc);
  box-shadow: var(--mobius-shadow-lg, 0 8px 24px rgba(0,0,0,0.18));
  font-size: var(--mobius-text-sm, 0.8125rem);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 160ms ease, transform 160ms ease;
}
.mobius-auth-toast.open { opacity: 1; transform: translateY(0); }
.mobius-auth-toast--success { background: #166534; color: #f0fdf4; }
.mobius-auth-toast--error { background: #991b1b; color: #fef2f2; }
.mobius-auth-toast--info { background: #1e3a8a; color: #eff6ff; }
`;
