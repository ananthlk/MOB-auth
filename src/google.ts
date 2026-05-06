/**
 * Google Identity Services (GIS) loader + ID-token retrieval.
 *
 * We use the `prompt()` flow rather than the rendered button so the
 * existing OAuth button in AuthModal stays visually consistent. The
 * frontend never sees the user's credentials — Google posts back a
 * signed ID token which the backend verifies against Google's JWKS.
 *
 * Docs: https://developers.google.com/identity/gsi/web/guides/overview
 */

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleIdConfig {
  client_id: string;
  callback: (resp: GoogleCredentialResponse) => void;
  ux_mode?: "popup" | "redirect";
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleAccountsId {
  initialize: (cfg: GoogleIdConfig) => void;
  prompt: (cb?: (notification: unknown) => void) => void;
  cancel: () => void;
  disableAutoSelect: () => void;
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleAccountsId } };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadGisScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity Services")));
      // If already loaded by the time we attached, the events won't fire.
      if (window.google?.accounts?.id) resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Google Identity Services"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Trigger the Google sign-in prompt. Resolves with the ID token (a JWT
 * string) the frontend should POST to the backend, or rejects if the
 * user dismisses the prompt or GIS fails to load.
 */
export async function getGoogleIdToken(clientId: string): Promise<string> {
  if (!clientId) throw new Error("Google client ID not configured");
  await loadGisScript();
  const accountsId = window.google?.accounts?.id;
  if (!accountsId) throw new Error("Google Identity Services unavailable");

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    accountsId.initialize({
      client_id: clientId,
      ux_mode: "popup",
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (resp) => {
        if (settled) return;
        settled = true;
        if (resp && typeof resp.credential === "string" && resp.credential) {
          resolve(resp.credential);
        } else {
          reject(new Error("Google did not return a credential"));
        }
      },
    });
    accountsId.prompt((notification: unknown) => {
      // notification has methods; if prompt was dismissed/skipped we should reject
      const n = notification as {
        isNotDisplayed?: () => boolean;
        isSkippedMoment?: () => boolean;
        isDismissedMoment?: () => boolean;
        getDismissedReason?: () => string;
      };
      try {
        if (n.isDismissedMoment?.() || n.isSkippedMoment?.() || n.isNotDisplayed?.()) {
          if (settled) return;
          settled = true;
          reject(new Error("Google sign-in was dismissed"));
        }
      } catch {
        /* ignore */
      }
    });
  });
}
