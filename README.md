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
EXPO_PUBLIC_ALLIO_API_URL=http://192.168.1.166:4100 npx expo start --clear
```

The Expo app also defaults to `http://192.168.1.166:4100` for local development. You can override it anytime from Settings.

## Structure

- `components/`: reusable UI building blocks.
- `screens/`: feature screens for each MVP workflow.
- `services/`: API and mock-data boundaries.
- `navigation/`: React Navigation stack setup.
- `backend/`: user-scoped carrier account linking and OAuth foundation.

## MVP Integration Notes

- Delivery tracking is mocked behind `services/deliveryService.js` for future AfterShip or EasyPost integration.
- Direct carrier account linking uses the backend OAuth foundation in `backend/`; Linked Accounts can connect, refresh, and disconnect UPS, FedEx, USPS, and DHL.
- Gmail/Outlook inbox checking uses the backend OAuth foundation in `backend/`; Linked Accounts can connect, refresh, and disconnect Gmail and Outlook.
- Wikipedia search uses the public Wikipedia REST search endpoint.
- Movie/TV search is mocked behind `services/movieService.js` for future TMDB or OMDb integration.
- Email sending is mocked behind `services/emailService.js`; no Gmail API or background sync is included.
