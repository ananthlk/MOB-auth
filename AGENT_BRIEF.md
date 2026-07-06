# mobius-auth — agent brief

## What this module is

`@mobius/auth` — a small (~2,200 lines TS), **zero-runtime-dependency** shared
UI library providing login / signup / preferences / account UI + logic for
Mobius products. Not published to npm — consumed as a local `file:`
dependency (`"@mobius/auth": "file:../../mobius-auth"`).

**Design intent (per README): shared between mobius-chat (web) and the
mobius-os extension** — same code, same UX, so login/signup/preferences look
and behave identically everywhere. **Reality today: only `mobius-chat`
actually imports it** (`mobius-chat/frontend/src/app.ts` +
`src/mobius-auth.d.ts`). The extension integration described in the README
doesn't appear wired in yet — worth confirming with the mobius-os agent
before assuming it's live there.

## Architecture (src/)

| File | Lines | Role |
|---|---|---|
| `AuthService.ts` | 404 | Core logic — calls `{apiBase}/api/v1`, pluggable storage, emits `AuthEvent`s |
| `PreferencesModal.ts` | 619 | Onboarding/preferences UI (name, activities, AI comfort, display tone) |
| `AuthModal.ts` | 373 | Login/signup/account modal — the file both diverged commits touch |
| `UserMenu.ts` | 268 | Sidebar user menu |
| `google.ts` | 115 | Google OAuth id-token flow |
| `styles.ts` | 180 | All CSS-in-JS (`AUTH_STYLES` export) |
| `storage/` | — | `localStorageAdapter` (web) + `chromeStorageAdapter` (extension, proxies via background script) |
| `toast.ts`, `types.ts` | — | Supporting |

Public API surface is `src/index.ts`: `createAuthService`,
`createAuthModal`, `createPreferencesModal`, `createUserMenu`,
`AUTH_STYLES`, storage adapters, `getGoogleIdToken`.

## Build — the gotcha to know immediately

- Build: `npm run build` -> `tsup` -> `dist/` (cjs + esm + `.d.ts`).
- **`dist/` is gitignored, not committed.** Any `src/` change requires a
  rebuild before `mobius-chat`'s `file:` dependency picks it up — same
  category of trap as `mobius-rag`'s frontend dist, but the opposite
  direction (correctly gitignored here, so no stale-tracked-snapshot risk,
  but easy to forget the rebuild step entirely).

## Current blocker — why this needed a human/new-agent decision

`mobius-auth`'s local `main` and its GitHub remote (`ananthlk/mobius-auth`)
have **diverged**:

- **Remote tip** `ad2f69e` (2026-05-06 07:52) — *"welcome panel routes to
  onboarding via `onOpenPreferences`"*. Adds a post-signup welcome panel with
  two buttons: "Set up preferences" (primary, calls
  `window.onOpenPreferences`) and "Skip for now" (secondary). Touches only
  `AuthModal.ts`.
- **Local-only, unpushed** `e6d5f77` (2026-05-06 13:26, same day, ~5.5h
  later) — *"welcome panel set-up-preferences CTA + secondary btn style"*.
  Describes and implements **the same feature** (same two buttons, same
  `onOpenPreferences` call), but also touches `styles.ts` — promotes
  `.mobius-auth-btn-secondary` from confirm-dialog-only scope to a general
  reusable class with a hover state.

**Read: this looks like the same welcome-panel task done twice independently
in two separate sessions** (same author attribution, same day), not a deep
logical conflict. `e6d5f77` was very likely branched before `ad2f69e` was
pulled in, so it's missing that history. The likely reconciliation is
straightforward: diff the two `AuthModal.ts` versions, confirm they land on
the same button wiring, and cherry-pick `e6d5f77`'s `styles.ts` hover-state
addition on top of whichever `AuthModal.ts` is more complete — but a new
agent should verify by reading both diffs rather than assume, since "looks
like duplicate work" isn't the same as "is safe to discard either side."

**What NOT to do:** a plain `git push` will be rejected (non-fast-forward);
force-pushing would destroy `ad2f69e` if that commit isn't otherwise
recoverable. This needs an actual merge or rebase, not a force-push.

## Commit history (full, only 6 commits)

```
39e2c4d Initial commit: shared auth package (AuthModal, PreferencesModal, UserMenu, AuthService)
d0962c1 Update styles
9e67011 feat: Google sign-in flow, welcome panel, toasts, logout confirm
41c82e7 feat(modal): also show Google / OAuth buttons on the Sign-up form
ad2f69e feat(modal): welcome panel routes to onboarding via onOpenPreferences   [remote tip]
e6d5f77 feat(auth): welcome panel set-up-preferences CTA + secondary btn style  [local, unpushed -- diverges from ad2f69e]
```

## First task for a new agent

1. Read both diverged commits' full diffs (`git show ad2f69e`, `git show
   e6d5f77`) — not just the stat summary above.
2. Reconcile onto a single `main` (merge or rebase — your call once you've
   read both) and push.
3. Rebuild (`npm run build`) so `mobius-chat` picks up whatever lands.
4. Confirm with the mobius-os/extension agent whether the extension
   integration described in the README is actually wired in yet, or still
   pending.
