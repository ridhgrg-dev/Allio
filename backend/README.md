# Allio Backend

This backend is the foundation for real account linking.

It does not ask users for carrier passwords or developer API keys. Instead, it prepares the correct production model:

1. Allio registers an app with UPS/FedEx/USPS/DHL and Gmail/Outlook.
2. User taps Connect in the mobile app.
3. Backend starts provider OAuth for that carrier.
4. Carrier redirects back to `/api/auth/:provider/callback`.
5. Backend stores provider tokens for that Allio user.
6. Mobile app requests that user's carrier/email connections, tracking data, and email inbox signals from this backend.

## Run

```bash
cd backend
cp .env.example .env
HOST=0.0.0.0 APP_BASE_URL=http://192.168.8.142:4100 npm run dev
```

The server defaults to:

```text
http://192.168.8.142:4100
```

For Expo Go on a physical phone, expose your Mac's LAN IP:

```bash
npm run backend:dev
npm start
```

## Current Provider State

The OAuth endpoints are scaffolded. Add developer app credentials at:

```text
http://192.168.8.142:4100/setup
```

The setup page currently focuses on UPS and Gmail. If credentials are missing, the mobile app opens this setup page before starting a real account connection.

Register these callback URLs with the providers:

```text
UPS:   http://192.168.8.142:4100/api/auth/ups/callback
Gmail: http://192.168.8.142:4100/api/email/auth/gmail/callback
```

Google does not allow raw LAN IP redirect URIs for real OAuth. Use a real HTTPS URL/tunnel or localhost web testing for Gmail OAuth.

Before production:

- Replace dev-token storage with encrypted database storage.
- Use real carrier OAuth app credentials.
- Add authenticated Allio user accounts.
- Add token refresh jobs.
- Add carrier-specific tracking API adapters.
- Add Gmail API and Microsoft Graph inbox adapters.
- Encrypt stored access and refresh tokens.
- Deploy over HTTPS.
