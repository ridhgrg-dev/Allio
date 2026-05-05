import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split('=');
    process.env[key] ||= valueParts.join('=');
  }
}

export const config = {
  port: Number(process.env.PORT || 4100),
  host: process.env.HOST || '127.0.0.1',
  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 4100}`,
  mobileDeepLink: process.env.MOBILE_DEEP_LINK || 'allio://connect',
  allowDevProviderLinks: process.env.ALLOW_DEV_PROVIDER_LINKS === 'true',
  allowDevOAuthSetup: process.env.ALLOW_DEV_OAUTH_SETUP === 'true',
  providers: {
    ups: {
      name: 'UPS',
      clientId: process.env.UPS_CLIENT_ID,
      clientSecret: process.env.UPS_CLIENT_SECRET,
      authUrl: process.env.UPS_AUTH_URL || 'https://wwwcie.ups.com/security/v1/oauth/authorize',
      tokenUrl: process.env.UPS_TOKEN_URL || 'https://wwwcie.ups.com/security/v1/oauth/token',
      scopes: ['tracking'],
    },
    fedex: {
      name: 'FedEx',
      clientId: process.env.FEDEX_CLIENT_ID,
      clientSecret: process.env.FEDEX_CLIENT_SECRET,
      authUrl: process.env.FEDEX_AUTH_URL,
      tokenUrl: process.env.FEDEX_TOKEN_URL,
      scopes: ['tracking'],
    },
    usps: {
      name: 'USPS',
      clientId: process.env.USPS_CLIENT_ID,
      clientSecret: process.env.USPS_CLIENT_SECRET,
      authUrl: process.env.USPS_AUTH_URL,
      tokenUrl: process.env.USPS_TOKEN_URL,
      scopes: ['tracking'],
    },
    dhl: {
      name: 'DHL',
      clientId: process.env.DHL_CLIENT_ID,
      clientSecret: process.env.DHL_CLIENT_SECRET,
      authUrl: process.env.DHL_AUTH_URL,
      tokenUrl: process.env.DHL_TOKEN_URL,
      scopes: ['tracking'],
    },
  },
  emailProviders: {
    gmail: {
      name: 'Gmail',
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      authUrl: process.env.GMAIL_AUTH_URL || 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: process.env.GMAIL_TOKEN_URL || 'https://oauth2.googleapis.com/token',
      scopes: ['openid', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
    },
    outlook: {
      name: 'Outlook',
      clientId: process.env.OUTLOOK_CLIENT_ID,
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
      authUrl: process.env.OUTLOOK_AUTH_URL,
      tokenUrl: process.env.OUTLOOK_TOKEN_URL,
      scopes: ['openid', 'email', 'offline_access', 'Mail.Read'],
    },
  },
};
