# Allio Backend

This backend is the foundation for real account linking.

It does not ask users for carrier passwords or developer API keys. Instead, it prepares the correct production model:

1. Allio registers a Google OAuth app for Gmail.
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

Gmail is the first real OAuth-backed provider. Users never enter API keys, client IDs, or secrets. Allio's deployed backend must be configured with Google OAuth credentials through environment variables or a secure secret manager.

Register these callback URLs with the providers:

```text
UPS:   http://192.168.8.142:4100/api/auth/ups/callback
Gmail: http://192.168.8.142:4100/api/email/auth/gmail/callback
```

Google does not allow raw LAN IP redirect URIs for real OAuth. Use a real HTTPS domain for production.

Gmail API behavior:

- User taps Connect Gmail in the mobile app.
- Backend redirects to Google's OAuth consent screen.
- Google redirects to `/api/email/auth/gmail/callback`.
- Backend exchanges the code for access/refresh tokens.
- `/api/users/:userId/emails` lists likely shipping emails with Gmail API and extracts tracking numbers.

For local developer-only testing, `/setup` and `/dev/connect/*` are disabled by default. Enable them only outside production:

```bash
ALLOW_DEV_OAUTH_SETUP=true ALLOW_DEV_PROVIDER_LINKS=true npm run dev
```

Carrier account linking is intentionally deferred. Delivery tracking should use tracking-number input first.

Before production:

- Replace dev-token storage with encrypted database storage.
- Use real carrier OAuth app credentials.
- Add authenticated Allio user accounts.
- Add token refresh jobs.
- Add carrier-specific tracking API adapters.
- Add Gmail API and Microsoft Graph inbox adapters.
- Encrypt stored access and refresh tokens.
- Deploy over HTTPS.
