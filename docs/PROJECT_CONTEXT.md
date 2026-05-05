# Allio Project Context

Use this file as durable memory for future sessions.

## Current Product

Allio is a React Native Expo mobile app for iOS and Android. The product vision is a universal hub where people can connect services and act from one place.

## Current Version

- Version: `1.3.0`
- Expo SDK: `54`
- Git branch: `main`
- GitHub repo: `https://github.com/ridhgrg-dev/Allio`

## Current MVP Features

- Home dashboard with modern command-center cards.
- Connected Services hub with mock link/unlink controls.
- Real external provider sign-in launchers from every account-link section.
- Persistent linked account state with AsyncStorage.
- Icon-led feature heroes for each major section.
- Delivery tracking with mock tracking results.
- Delivery tracking history and favorite tracking numbers.
- Keyboard-aware forms and submit actions across search/tracking/email screens.
- Real AfterShip API-key connector for delivery account sync.
- Wikipedia search using the public Wikipedia REST endpoint.
- Movie/TV search using mock data.
- Email compose screen with mock send confirmation.

## Integration Policy

Keep paid or complex integrations mocked until the UI and user flow are validated.

- Delivery: mock now; later consider AfterShip or EasyPost.
- Wikipedia: real public search now; later add account-aware features if useful.
- Movie/TV: mock now; later use TMDB through a backend proxy.
- Email: mock now; later use OAuth for Gmail/Outlook.
- Account linking: mock now; later use provider-specific OAuth/API setup.

Provider sign-in links open real external account pages, but most providers do not yet have OAuth callback handling in Allio.

Local persistence currently stores linked account booleans plus delivery history/favorites. Version `1.3.0` also stores an AfterShip API key locally for prototype real delivery sync; move this secret to a backend before production distribution.

## Technical Notes

- Must run in Expo Go.
- Project is pinned to Expo SDK 54 because the App Store Expo Go version currently supports SDK 54.
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
npx expo start --clear
```

## Git Practice

Every meaningful change should include:

- Version bump in `package.json`, `package-lock.json`, and `app.json`.
- Entry in `CHANGELOG.md`.
- Commit with a clear message.
- Push to `origin/main`.
- Tag for production-like milestones, for example `v1.0.1`.
