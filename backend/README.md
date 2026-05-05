# Allio Backend

This backend is the foundation for real account linking.

It does not ask users for carrier passwords or developer API keys. Instead, it prepares the correct production model:

1. Allio registers an app with UPS/FedEx/USPS/DHL.
2. User taps Connect in the mobile app.
3. Backend starts provider OAuth for that carrier.
4. Carrier redirects back to `/api/auth/:provider/callback`.
5. Backend stores provider tokens for that Allio user.
6. Mobile app requests that user's carrier connections and tracking data from this backend.

## Run

```bash
cd backend
cp .env.example .env
npm run dev
```

The server defaults to:

```text
http://localhost:4100
```

For Expo Go on a physical phone, expose your Mac's LAN IP:

```bash
HOST=0.0.0.0 APP_BASE_URL=http://YOUR_MAC_IP:4100 npm run dev
EXPO_PUBLIC_ALLIO_API_URL=http://YOUR_MAC_IP:4100 npx expo start --clear
```

## Current Provider State

The OAuth endpoints are scaffolded. If provider credentials are missing, the backend uses a local dev connection flow so the mobile app can exercise user-specific connection records.

Before production:

- Replace dev-token storage with encrypted database storage.
- Use real carrier OAuth app credentials.
- Add authenticated Allio user accounts.
- Add token refresh jobs.
- Add carrier-specific tracking API adapters.
- Deploy over HTTPS.
