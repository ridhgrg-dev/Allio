import crypto from 'node:crypto';
import { config } from './config.js';
import { consumeOAuthState, listConnections, saveConnection, saveOAuthState } from './store.js';

const devMessages = [
  {
    id: 'dev-email-1',
    from: 'shipping@ups.example',
    subject: 'Your UPS package is on the way',
    body: 'Good news. Your package shipped with UPS. Tracking number: 1Z999AA10123456784.',
    receivedAt: new Date().toISOString(),
  },
  {
    id: 'dev-email-2',
    from: 'updates@fedex.example',
    subject: 'FedEx shipment update',
    body: 'FedEx tracking 449044304137821 is now in transit.',
    receivedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: 'dev-email-3',
    from: 'orders@example-store.test',
    subject: 'Your order has shipped',
    body: 'USPS label created. Track with 9400111206213850123456.',
    receivedAt: new Date(Date.now() - 7200 * 1000).toISOString(),
  },
];

export function listEmailProviders() {
  return Object.entries(config.emailProviders).map(([id, provider]) => ({
    id,
    name: provider.name,
    configured: Boolean(provider.clientId && provider.clientSecret && provider.authUrl && provider.tokenUrl),
  }));
}

export async function createEmailAuthStartUrl(providerId, userId) {
  const provider = config.emailProviders[providerId];

  if (!provider) {
    throw new Error('Unknown email provider.');
  }

  const state = crypto.randomBytes(24).toString('hex');
  await saveOAuthState(state, {
    userId,
    providerId,
    kind: 'email',
    createdAt: new Date().toISOString(),
  });

  if (!provider.clientId || !provider.authUrl) {
    return `${config.appBaseUrl}/dev/email/connect/${providerId}?state=${encodeURIComponent(state)}`;
  }

  const callbackUrl = `${config.appBaseUrl}/api/email/auth/${providerId}/callback`;
  const authUrl = new URL(provider.authUrl);
  authUrl.searchParams.set('client_id', provider.clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', provider.scopes.join(' '));

  return authUrl.toString();
}

export async function completeEmailOAuth(providerId, state, code) {
  const oauthState = await consumeOAuthState(state);

  if (!oauthState || oauthState.providerId !== providerId || oauthState.kind !== 'email') {
    throw new Error('Invalid or expired email connection state.');
  }

  const provider = config.emailProviders[providerId];
  const configured = Boolean(provider?.clientId && provider?.clientSecret && provider?.tokenUrl);

  const tokenRecord = configured
    ? await exchangeEmailCodeForToken(providerId, code)
    : {
        accessToken: `dev-email-${providerId}-${Date.now()}`,
        refreshToken: null,
        expiresAt: null,
        mode: 'development',
      };

  return saveConnection(oauthState.userId, providerId, {
    providerId,
    providerName: provider.name,
    kind: 'email',
    connectedAt: new Date().toISOString(),
    token: tokenRecord,
  });
}

async function exchangeEmailCodeForToken(providerId, code) {
  const provider = config.emailProviders[providerId];
  const callbackUrl = `${config.appBaseUrl}/api/email/auth/${providerId}/callback`;
  const body = new URLSearchParams({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: callbackUrl,
  });

  const response = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`${provider.name} token exchange failed.`);
  }

  const token = await response.json();

  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token || null,
    expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000).toISOString() : null,
    mode: 'oauth',
  };
}

export function extractTrackingNumbers(text) {
  const normalized = String(text || '').toUpperCase();
  const patterns = [
    { carrier: 'UPS', regex: /\b1Z[0-9A-Z]{16}\b/g },
    { carrier: 'USPS', regex: /\b(?:92|93|94|95)\d{20,22}\b/g },
    { carrier: 'FedEx', regex: /\b\d{12,22}\b/g },
    { carrier: 'DHL', regex: /\b\d{10}\b/g },
  ];
  const found = [];

  for (const pattern of patterns) {
    const matches = normalized.match(pattern.regex) || [];
    for (const match of matches) {
      if (!found.some((item) => item.trackingNumber === match)) {
        found.push({
          carrier: pattern.carrier,
          trackingNumber: match,
        });
      }
    }
  }

  return found;
}

export async function listEmailInbox(userId) {
  const connections = await listConnections(userId);
  const connectedEmailProviders = Object.keys(connections).filter((providerId) => {
    return config.emailProviders[providerId];
  });

  if (!connectedEmailProviders.length) {
    throw new Error('Connect Gmail or Outlook first.');
  }

  return devMessages.map((message) => ({
    ...message,
    providerId: connectedEmailProviders[0],
    trackingCandidates: extractTrackingNumbers(`${message.subject}\n${message.body}`),
  }));
}
