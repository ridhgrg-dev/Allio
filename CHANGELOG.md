# Changelog

All notable changes to Allio are tracked here.

The project uses semantic versioning:

- Patch: documentation, polish, small fixes, dependency pinning.
- Minor: new screens, new mocked flows, meaningful UI/UX additions.
- Major: breaking navigation/data model changes or production API architecture changes.

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
