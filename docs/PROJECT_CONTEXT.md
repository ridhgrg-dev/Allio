# Allio Project Context

Use this file as durable memory for future sessions.

## Current Product

Allio is a React Native Expo mobile app for iOS and Android. The product vision is a universal hub where people can connect services and act from one place.

## Current Version

- Version: `1.11.1`
- Expo SDK: `54`
- Git branch: `main`
- GitHub repo: `https://github.com/ridhgrg-dev/Allio`

## Current MVP Features

- Home dashboard with modern command-center cards.
- Account Setup under Settings for provider connection management.
- Real external provider sign-in launchers from every account-link section.
- Persistent linked account state with AsyncStorage.
- Icon-led feature heroes for each major section.
- Delivery tracking with mock tracking results.
- Delivery tracking history and favorite tracking numbers.
- Keyboard-aware forms and submit actions across search/tracking/email screens.
- Direct carrier account linking UX for UPS, FedEx, USPS, and DHL.
- Backend foundation for user-scoped carrier OAuth connections.
- Backend foundation for user-scoped Gmail/Outlook email OAuth connections.
- Wikipedia search using the public Wikipedia REST endpoint.
- Movie/TV search using mock data.
- Email compose screen with mock send confirmation.
- Email inbox checking with tracking-number extraction.
- Hamburger-style app menu and Settings panel.
- Runtime backend URL setup with backend health check.

## Integration Policy

Keep paid or complex integrations mocked until the UI and user flow are validated.

- Delivery: direct carrier account UX now; later add real UPS/FedEx/USPS/DHL OAuth through a backend.
- Wikipedia: real public search now; later add account-aware features if useful.
- Movie/TV: mock now; later use TMDB through a backend proxy.
- Email: Gmail/Outlook OAuth backend foundation now; production needs real provider app credentials and token storage hardening.
- Account linking: mock now; later use provider-specific OAuth/API setup.

Provider sign-in links open real external account pages, but most providers do not yet have OAuth callback handling in Allio.

Local persistence currently stores linked account booleans plus delivery history/favorites. Do not ask users for carrier passwords or developer API keys. True direct carrier sync should use carrier OAuth/API app registration with the `backend/` token exchange foundation.

When backend is available, set `EXPO_PUBLIC_ALLIO_API_URL` before starting Expo. On a physical phone, use the Mac LAN IP instead of `localhost`.

Version `1.7.0` also supports setting the backend URL at runtime from the Settings panel; this is preferred for Expo Go testing.

Version `1.7.1` defaults local Expo Go backend calls to `http://192.168.1.166:4100`, matching the current Mac LAN IP. Use Settings to override it if the Mac IP changes.

Version `1.8.0` upgrades Linked Accounts to use backend account-linking actions for UPS, FedEx, USPS, DHL, Gmail, and Outlook, with refresh/disconnect support and provider credential status messaging.

Version `1.8.1` cleans up app organization by centralizing Home/Menu section metadata, making the hamburger panel a navigation-only surface, and reducing Settings to backend plus account setup.

Version `1.8.2` adds Node LTS pinning and safer Expo start scripts after Expo dev server startup failed under Node 24.

Version `1.8.3` updates the local backend dev script and backend env examples to bind on `0.0.0.0` with `http://192.168.1.166:4100`, so Expo Go on a phone can reach it.

Version `1.8.4` updates the local backend URL to the current Mac IP `http://192.168.8.142:4100` and treats the previous `192.168.1.166` URL as retired so saved old settings do not keep breaking backend checks.

Version `1.9.0` adds a backend OAuth credential setup page and changes Linked Accounts so UPS/Gmail Connect opens setup when real provider developer credentials are missing instead of silently using dev-link mode.

Version `1.10.0` restores the production UX model: users never see credential setup. Provider credentials are backend-owned, dev setup/dev linking are opt-in by environment flag only, and unconfigured providers show as coming soon until Allio has provider approval and deployed OAuth credentials.

Version `1.10.1` removes account setup from Home, hamburger navigation, Delivery, Email, Wikipedia, and Movie/TV screens. Provider connection management now lives only under Settings.

Version `1.11.0` implements Gmail as the first real OAuth-backed account link: Connect Gmail redirects to Google consent, backend stores tokens, refreshes access tokens, calls Gmail API for likely shipping emails, and extracts tracking numbers.

Version `1.11.1` makes Gmail Connect open the local developer setup page when Gmail OAuth credentials are missing and backend dev setup mode is enabled.

## Technical Notes

- Must run in Expo Go.
- Project is pinned to Expo SDK 54 because the App Store Expo Go version currently supports SDK 54.
- Use Node LTS, preferably Node 22 from `.nvmrc`; Node 24 can crash Expo's dev server port finder before the app opens.
- Use `env PATH=/usr/local/bin:$PATH ...` if the assistant sandbox cannot see `node` or `npm`.
- Keep UI and service logic separate.
- Keep reusable UI in `components/`, app screens in `screens/`, API/mock boundaries in `services/`, and navigation in `navigation/`.

## Verification Commands

```bash
npm run check:deps
npm run export:ios
npm run export:android
```

Run locally:

```bash
npm install
npm start
```

Run backend locally:

```bash
npm run backend:dev
```

Open real OAuth credential setup:

```text
http://192.168.8.142:4100/setup
```

## Git Practice

Every meaningful change should include:

- Version bump in `package.json`, `package-lock.json`, and `app.json`.
- Entry in `CHANGELOG.md`.
- Commit with a clear message.
- Push to `origin/main`.
- Tag for production-like milestones, for example `v1.0.1`.
