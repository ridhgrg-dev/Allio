import crypto from 'node:crypto';
import { config } from './config.js';
import { consumeOAuthState, saveConnection, saveOAuthState } from './store.js';

export function listCarriers() {
  return Object.entries(config.providers).map(([id, provider]) => ({
    id,
    name: provider.name,
    configured: Boolean(provider.clientId && provider.clientSecret && provider.authUrl && provider.tokenUrl),
  }));
}

export async function createAuthStartUrl(providerId, userId) {
  const provider = config.providers[providerId];

  if (!provider) {
    throw new Error('Unknown carrier provider.');
  }

  const state = crypto.randomBytes(24).toString('hex');
  await saveOAuthState(state, {
    userId,
    providerId,
    createdAt: new Date().toISOString(),
  });

  if (!provider.clientId || !provider.authUrl) {
    return `${config.appBaseUrl}/dev/connect/${providerId}?state=${encodeURIComponent(state)}`;
  }

  const callbackUrl = `${config.appBaseUrl}/api/auth/${providerId}/callback`;
  const authUrl = new URL(provider.authUrl);
  authUrl.searchParams.set('client_id', provider.clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('state', state);

  if (provider.scopes?.length) {
    authUrl.searchParams.set('scope', provider.scopes.join(' '));
  }

  return authUrl.toString();
}

export async function completeOAuth(providerId, state, code) {
  const oauthState = await consumeOAuthState(state);

  if (!oauthState || oauthState.providerId !== providerId) {
    throw new Error('Invalid or expired connection state.');
  }

  const provider = config.providers[providerId];
  const configured = Boolean(provider?.clientId && provider?.clientSecret && provider?.tokenUrl);

  const tokenRecord = configured
    ? await exchangeCodeForToken(providerId, code)
    : {
        accessToken: `dev-${providerId}-${Date.now()}`,
        refreshToken: null,
        expiresAt: null,
        mode: 'development',
      };

  return saveConnection(oauthState.userId, providerId, {
    providerId,
    providerName: provider.name,
    connectedAt: new Date().toISOString(),
    token: tokenRecord,
  });
}

async function exchangeCodeForToken(providerId, code) {
  const provider = config.providers[providerId];
  const callbackUrl = `${config.appBaseUrl}/api/auth/${providerId}/callback`;
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: callbackUrl,
  });

  const response = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${provider.clientId}:${provider.clientSecret}`).toString('base64')}`,
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

export function createTrackingResponse(providerId, trackingNumber) {
  const provider = config.providers[providerId];

  return {
    trackingNumber,
    carrier: provider?.name || providerId.toUpperCase(),
    status: 'Connected account ready',
    estimatedDelivery: 'Carrier API adapter pending',
    updates: [
      {
        time: new Date().toISOString(),
        location: provider?.name || 'Carrier account',
        detail: 'Allio has a user-specific carrier connection. Add the carrier tracking adapter next.',
      },
    ],
  };
}
