import crypto from 'node:crypto';
import { config } from './config.js';
import { listProviderCredentialStatus, mergeProviderCredentials } from './providerCredentials.js';
import { consumeOAuthState, listConnections, saveConnection, saveOAuthState, updateConnection } from './store.js';

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
  return listProviderCredentialStatus(config.emailProviders, 'emailProviders', config.allowDevOAuthSetup);
}

export async function createEmailAuthStartUrl(providerId, userId) {
  const provider = mergeProviderCredentials(config.emailProviders, 'emailProviders', config.allowDevOAuthSetup)[providerId];

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

  if (!provider.clientId || !provider.clientSecret || !provider.authUrl || !provider.tokenUrl) {
    if (!config.allowDevProviderLinks) {
      throw new Error(`${provider.name} is not available yet. Allio needs production provider credentials before users can connect.`);
    }

    return `${config.appBaseUrl}/dev/email/connect/${providerId}?state=${encodeURIComponent(state)}`;
  }

  const callbackUrl = `${config.appBaseUrl}/api/email/auth/${providerId}/callback`;
  const authUrl = new URL(provider.authUrl);
  authUrl.searchParams.set('client_id', provider.clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', provider.scopes.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('include_granted_scopes', 'true');

  return authUrl.toString();
}

export async function completeEmailOAuth(providerId, state, code) {
  const oauthState = await consumeOAuthState(state);

  if (!oauthState || oauthState.providerId !== providerId || oauthState.kind !== 'email') {
    throw new Error('Invalid or expired email connection state.');
  }

  const provider = mergeProviderCredentials(config.emailProviders, 'emailProviders', config.allowDevOAuthSetup)[providerId];
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
  const provider = mergeProviderCredentials(config.emailProviders, 'emailProviders', config.allowDevOAuthSetup)[providerId];
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

function decodeBase64Url(value) {
  if (!value) {
    return '';
  }

  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function getHeader(headers, name) {
  return headers.find((header) => header.name.toLowerCase() === name.toLowerCase())?.value || '';
}

function getPlainTextFromPayload(payload) {
  if (!payload) {
    return '';
  }

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts?.length) {
    return payload.parts.map(getPlainTextFromPayload).filter(Boolean).join('\n');
  }

  return payload.body?.data ? decodeBase64Url(payload.body.data) : '';
}

function isTokenExpired(token) {
  if (!token?.expiresAt) {
    return false;
  }

  return new Date(token.expiresAt).getTime() <= Date.now() + 60 * 1000;
}

async function refreshGmailToken(userId, connection) {
  if (!connection.token?.refreshToken) {
    throw new Error('Gmail access expired. Disconnect Gmail and connect again.');
  }

  const provider = mergeProviderCredentials(config.emailProviders, 'emailProviders', config.allowDevOAuthSetup).gmail;
  const body = new URLSearchParams({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: connection.token.refreshToken,
  });

  const response = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('Gmail token refresh failed. Disconnect Gmail and connect again.');
  }

  const refreshed = await response.json();
  const nextToken = {
    ...connection.token,
    accessToken: refreshed.access_token,
    expiresAt: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString() : connection.token.expiresAt,
  };

  await updateConnection(userId, 'gmail', {
    token: nextToken,
  });

  return nextToken;
}

async function getValidGmailAccessToken(userId, connection) {
  if (isTokenExpired(connection.token)) {
    return (await refreshGmailToken(userId, connection)).accessToken;
  }

  return connection.token.accessToken;
}

async function fetchGmailJson(path, accessToken) {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Gmail API request failed.');
  }

  return response.json();
}

async function listGmailTrackingMessages(userId, connection) {
  const accessToken = await getValidGmailAccessToken(userId, connection);
  const query = 'newer_than:90d (tracking OR shipment OR shipped OR package OR delivery OR UPS OR FedEx OR USPS OR DHL)';
  const params = new URLSearchParams({
    maxResults: '20',
    q: query,
  });
  const list = await fetchGmailJson(`messages?${params.toString()}`, accessToken);
  const messages = list.messages || [];

  return Promise.all(messages.map(async (message) => {
    const detailParams = new URLSearchParams({
      format: 'full',
    });
    const detail = await fetchGmailJson(`messages/${message.id}?${detailParams.toString()}`, accessToken);
    const headers = detail.payload?.headers || [];
    const subject = getHeader(headers, 'Subject') || '(No subject)';
    const from = getHeader(headers, 'From') || 'Unknown sender';
    const body = getPlainTextFromPayload(detail.payload) || detail.snippet || '';

    return {
      id: detail.id,
      providerId: 'gmail',
      from,
      subject,
      body: detail.snippet || body.slice(0, 280),
      receivedAt: detail.internalDate ? new Date(Number(detail.internalDate)).toISOString() : new Date().toISOString(),
      trackingCandidates: extractTrackingNumbers(`${subject}\n${body}\n${detail.snippet || ''}`),
    };
  }));
}

export async function listEmailInbox(userId) {
  const connections = await listConnections(userId);
  const connectedEmailProviders = Object.keys(connections).filter((providerId) => {
    return config.emailProviders[providerId];
  });

  if (!connectedEmailProviders.length) {
    throw new Error('Connect Gmail first.');
  }

  if (connections.gmail?.token?.mode === 'oauth') {
    return listGmailTrackingMessages(userId, connections.gmail);
  }

  return devMessages.map((message) => ({
    ...message,
    providerId: connectedEmailProviders[0],
    trackingCandidates: extractTrackingNumbers(`${message.subject}\n${message.body}`),
  }));
}
