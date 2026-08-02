# DPAMS Progressive Web App

## Architecture

DPAMS uses the App Router manifest route (`src/app/manifest.ts`), a production-only service-worker registration, and `public/sw.js`. `PWAProvider` owns install, connectivity, and update UI. Development remains service-worker free.

The worker is deliberately dependency-free and versioned with `VERSION`. During activation it claims open clients and removes older DPAMS caches. Change `VERSION` whenever worker cache behavior or pre-cached assets change.

## Installation

Production must be served over HTTPS (localhost is also accepted by browsers). Chrome, Edge, and Android users receive the native install prompt. On iOS, the UI explains the Share → Add to Home Screen flow. The prompt disappears after installation or in standalone mode.

## Offline and caching behavior

The offline route, manifest, and core icons are pre-cached. Immutable Next.js assets and safe public CSS, scripts, fonts, and images use cache-first behavior. Navigations use the network and fall back to the offline page.

Privacy takes priority over broad offline data availability. API calls, authenticated requests, dashboards, appointments, patient/doctor data, profiles, notifications, laboratory data, reports, prescriptions, documents, uploads, consultations, and queues are explicitly excluded. Tokens, cookies, credentials, and protected health information are never written to Cache Storage. Any future offline medical-data feature requires encrypted, per-user storage, expiry, logout erasure, threat review, and explicit product approval.

The global offline indicator tells users that displayed information may be stale. The offline page listens for connectivity changes and provides an accessible Retry action.

## Update flow

The worker uses `skipWaiting`, `clients.claim`, no-cache response headers, and versioned cache cleanup. When a newly deployed worker takes control, the global UI shows “A new version is available.” The Update button reloads the application.

## Future push notifications

The worker contains `push` and `notificationclick` extension points. Before enabling them, implement authenticated subscription endpoints, VAPID key management, permission UI, role-aware payloads, minimal non-sensitive notification text, and revocation/logout cleanup. Do not include medical details in lock-screen-visible payloads.

## Background synchronization plan

The `dpams-sync` event is reserved but intentionally performs no writes. A future implementation should use an encrypted, user-scoped IndexedDB queue with idempotency keys, CSRF/auth refresh safeguards, exponential retry, conflict handling, audit events, expiry, and mandatory cleanup on logout. Server endpoints must support idempotent replay before this is enabled.

## Testing

1. Run `npm run lint` and `npm run build` in `frontend`.
2. Serve the production build with `npm start` over HTTPS or localhost.
3. In browser DevTools → Application, verify the manifest, icons, standalone display, and active `/sw.js` scope.
4. Load the landing page once, select Offline in DevTools, and navigate to confirm `/offline` appears.
5. Verify no `/api/`, dashboard, document, or authenticated responses appear in Cache Storage.
6. Increment `VERSION`, rebuild, and deploy; verify the update banner appears and Update reloads.
7. Run Lighthouse in a clean incognito profile. Test keyboard focus, screen-reader announcements, light/dark themes, Android/desktop installation, and iOS Add to Home Screen separately.

Browser installability and Lighthouse scores must be confirmed against the final HTTPS deployment because they depend on production headers, origin, response timing, and browser version.
