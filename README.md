# Allio

Allio is a mobile-first Expo app for iOS and Android. The MVP keeps the universal hub vision focused: delivery tracking, Wikipedia search, movie/TV search, and basic email composition.

## Run Locally

```bash
npm install
npm start
```

Open the QR code with Expo Go on iOS or Android.

Allio expects Node LTS. If Expo does not open or the dev server crashes, use Node 22:

```bash
nvm install 22
nvm use
npm start
```

If your phone cannot reach the LAN QR code, use:

```bash
npm run start:tunnel
```

## Run With Backend

The backend is optional for the current Expo Go prototype. It is needed for real user-scoped carrier and email account linking.

```bash
cd backend
cp .env.example .env
npm run dev
```

From the project root you can also run the phone-ready backend command:

```bash
npm run backend:dev
```

Then start Expo with your backend URL:

```bash
EXPO_PUBLIC_ALLIO_API_URL=http://192.168.8.142:4100 npx expo start --clear
```

The Expo app also defaults to `http://192.168.8.142:4100` for local development. You can override it anytime from Settings.

In production, users never enter API keys, client IDs, or secrets. Allio's backend owns provider credentials, and users only tap Connect, sign in on the provider page, and return to Allio.

Gmail is the first real account-linking path. The backend uses Google OAuth, stores the user's secure token server-side, calls the Gmail API with `gmail.readonly`, scans likely shipping emails, and extracts tracking numbers. Users only sign in through Google's consent workflow; they never enter client secrets. Google requires Allio to register an OAuth app and callback URL before Gmail Connect is available. Google does not accept raw LAN IP redirect URIs for real OAuth, so production needs HTTPS on an approved domain.

## Structure

- `components/`: reusable UI building blocks.
- `screens/`: feature screens for each MVP workflow.
- `services/`: API and mock-data boundaries.
- `navigation/`: React Navigation stack setup.
- `backend/`: user-scoped carrier account linking and OAuth foundation.

## MVP Integration Notes

- Delivery tracking is tracking-number based for now; users can choose UPS, FedEx, USPS, or DHL context without linking individual carrier accounts.
- Direct carrier account linking is deferred until later.
- Gmail inbox checking uses backend OAuth and the Gmail API to scan shipping emails for tracking numbers.
- Wikipedia search uses the public Wikipedia REST search endpoint.
- Movie/TV search is mocked behind `services/movieService.js` for future TMDB or OMDb integration.
- Email sending is mocked behind `services/emailService.js`; Gmail API access is read-only for tracking extraction.
