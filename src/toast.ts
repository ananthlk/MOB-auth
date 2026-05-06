/**
 * Lightweight toast helper for auth flows.
 *
 * The host page may already provide `window.showToast(message)`; if so we
 * forward to it so toasts share the host's existing styling. Otherwise we
 * render our own minimal toast in a fixed bottom-right host container.
 */

export type ToastVariant = "success" | "error" | "info";

let hostEl: HTMLDivElement | null = null;

function ensureHost(): HTMLDivElement {
  if (hostEl && hostEl.isConnected) return hostEl;
  const existing = document.querySelector(".mobius-auth-toast-host");
  if (existing) {
    hostEl = existing as HTMLDivElement;
    return hostEl;
  }
  const el = document.createElement("div");
  el.className = "mobius-auth-toast-host";
  document.body.appendChild(el);
  hostEl = el;
  return el;
}

export function showToast(message: string, variant: ToastVariant = "info", durationMs = 2800): void {
  if (!message) return;

  // Prefer host-provided toast if present (chat app may have its own).
  const hostToast = (window as unknown as { showToast?: (s: string) => void }).showToast;
  if (typeof hostToast === "function") {
    try {
      hostToast(message);
      return;
    } catch {
      /* fall through to our own */
    }
  }

  const host = ensureHost();
  const toast = document.createElement("div");
  toast.className = `mobius-auth-toast mobius-auth-toast--${variant}`;
  toast.setAttribute("role", variant === "error" ? "alert" : "status");
  toast.textContent = message;
  host.appendChild(toast);

  // Force reflow then animate in.
  void toast.offsetWidth;
  toast.classList.add("open");

  const remove = () => {
    toast.classList.remove("open");
    setTimeout(() => toast.remove(), 200);
  };
  setTimeout(remove, durationMs);
}
