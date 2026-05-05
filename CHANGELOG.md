# Changelog

All notable changes to Allio are tracked here.

The project uses semantic versioning:

- Patch: documentation, polish, small fixes, dependency pinning.
- Minor: new screens, new mocked flows, meaningful UI/UX additions.
- Major: breaking navigation/data model changes or production API architecture changes.

## 1.8.2 - 2026-05-05

- Added `.nvmrc` and Node engine guidance for Node 20/22 LTS.
- Updated `npm start` to clear Metro cache and use LAN mode by default.
- Added a tunnel start script for phones that cannot reach the local LAN server.
- Documented the Node 24 Expo dev-server startup issue.

## 1.8.1 - 2026-05-05

- Centralized Home dashboard and hamburger navigation metadata.
- Renamed the hamburger panel to Navigation and removed the duplicate Settings row.
- Simplified Settings so it focuses on backend setup and one Linked Accounts entry point.
- Refined Home card copy to better match the current backend/account-linking flows.

## 1.8.0 - 2026-05-05

- Upgraded Connected Services from prototype toggles to backend-aware account linking.
- Added backend refresh for linked UPS, FedEx, USPS, DHL, Gmail, and Outlook accounts.
- Added backend disconnect support from Linked Accounts.
- Added provider credential status messaging so dev-linking versus real OAuth configuration is visible.

## 1.7.1 - 2026-05-05

- Set the local development backend fallback URL to `http://192.168.1.166:4100`.
- Updated the Settings backend URL placeholder and run docs to match the current Mac LAN IP.

## 1.7.0 - 2026-05-05

- Added hamburger-style app menu from the Home dashboard.
- Added Settings panel for backend URL setup, backend health checks, and account setup navigation.
- Added runtime backend URL storage so Expo Go can configure backend without rebuilding.
- Improved backend connection errors for unreachable or invalid backend responses.
- Added `allio` app scheme for future OAuth/deep-link returns.
- Stopped marking providers connected immediately after opening backend auth setup.

## 1.6.0 - 2026-05-05

- Added backend email OAuth foundation for Gmail and Outlook.
- Added user-scoped email connection routes and development email connection fallback.
- Added linked email inbox endpoint.
- Added tracking-number extraction for email subjects and bodies.
- Added Email screen inbox checking for linked email accounts.
- Added extracted tracking-number cards that save found numbers into Delivery history.

## 1.5.0 - 2026-05-05

- Added a backend foundation for user-scoped carrier account linking.
- Added OAuth start/callback routes for UPS, FedEx, USPS, and DHL.
- Added local development persistence for user carrier connection records.
- Added backend tracking endpoint shape for connected carrier accounts.
- Added mobile backend service helpers and persistent Allio user ids.
- Added backend run instructions and optional Expo backend URL configuration.

## 1.4.0 - 2026-05-04

- Removed the AfterShip API-key connector from the user-facing delivery flow.
- Shifted delivery toward simple direct carrier account linking for UPS, FedEx, USPS, and DHL.
- Added a linked-carrier tracking mode selector.
- Kept tracking history and favorites working with the selected linked carrier context.
- Documented that true direct carrier sync requires carrier OAuth/API app registration and a backend token exchange.

## 1.3.0 - 2026-05-04

- Added a real AfterShip delivery account connector using an API key.
- Added save, update, disconnect, and sync controls for AfterShip.
- Added real tracking sync into Allio delivery history and favorites.
- Added shared account-link setter so real provider status can be forced linked/unlinked.
- Documented that prototype API keys are stored locally and should move to a backend before production.

## 1.2.1 - 2026-05-04

- Added keyboard-aware screen layout so forms are not hidden while typing.
- Added keyboard submit actions for tracking, Wikipedia search, Movie/TV search, and email form fields.
- Improved tracking number normalization for pasted values with spaces or dashes.
- Added friendlier tracking number validation.
- Polished input field styling and search feedback.

## 1.2.0 - 2026-05-04

- Added on-device persistence for linked provider accounts with AsyncStorage.
- Added delivery tracking history that persists across app restarts.
- Added favorite tracking numbers for future tracking.
- Added Favorites and History sections to Delivery Tracking.
- Added reusable delivery history cards with favorite toggles and quick re-track actions.

## 1.1.0 - 2026-05-04

- Added icon-led modern feature heroes to Delivery, Wikipedia, Movie/TV, and Email screens.
- Added reusable account-link panels to every major section.
- Added real external provider sign-in launchers for delivery, Wikipedia/Wikimedia, movie/TV, and email providers.
- Added in-app linked/unlinked state controls for provider setup prototypes.
- Added Ionicons across dashboard cards and provider rows.
- Kept OAuth/token storage out of the client until a backend is added.

## 1.0.1 - 2026-05-04

- Added production-style project tracking docs.
- Added release/version workflow guidance.
- Added reusable verification scripts in `package.json`.
- Updated app splash/adaptive icon background to match the modernized UI.

## 1.0.0 - 2026-05-04

- Built the Allio Expo Go MVP.
- Added Home dashboard, Delivery Tracking, Wikipedia Search, Movie/TV Search, Email, and Connected Services screens.
- Added mock connection hub for delivery services, Wikipedia/Wikimedia, movie/TV services, and email providers.
- Kept delivery, media, email, and account linking mocked for MVP safety.
- Used real public Wikipedia search.
- Downgraded to Expo SDK 54 for App Store Expo Go compatibility.
