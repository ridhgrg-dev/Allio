import http from 'node:http';
import { URL } from 'node:url';
import { config } from './config.js';
import { completeOAuth, createAuthStartUrl, createTrackingResponse, listCarriers } from './carriers.js';
import { completeEmailOAuth, createEmailAuthStartUrl, listEmailInbox, listEmailProviders } from './email.js';
import { saveProviderCredentials } from './providerCredentials.js';
import { deleteConnection, listConnections } from './store.js';

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(body);
}

function sendHtml(res, status, html) {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
  });
  res.end(html);
}

function redirect(res, url) {
  res.writeHead(302, { Location: url });
  res.end();
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function readForm(req) {
  const body = await readBody(req);
  return Object.fromEntries(new URLSearchParams(body));
}

function renderCredentialCard({ provider, kind, callbackUrl, note }) {
  return `
    <section class="card">
      <div>
        <h2>${escapeHtml(provider.name)}</h2>
        <p class="${provider.configured ? 'ok' : 'warn'}">${provider.configured ? 'Real OAuth credentials configured' : 'Needs client ID and secret'}</p>
      </div>
      <p class="small">Callback URL to register: <code>${escapeHtml(callbackUrl)}</code></p>
      <p class="small">${escapeHtml(note)}</p>
      <form method="post" action="/api/setup/${kind}/${provider.id}">
        <label>Client ID<input name="clientId" autocomplete="off" /></label>
        <label>Client Secret<input name="clientSecret" autocomplete="off" type="password" /></label>
        <label>Authorization URL<input name="authUrl" value="${escapeHtml(provider.authUrl || '')}" /></label>
        <label>Token URL<input name="tokenUrl" value="${escapeHtml(provider.tokenUrl || '')}" /></label>
        <button type="submit">Save ${escapeHtml(provider.name)} Credentials</button>
      </form>
    </section>
  `;
}

function renderSetupPage(url) {
  const carriers = listCarriers().filter((provider) => provider.id === 'ups');
  const emailProviders = listEmailProviders().filter((provider) => provider.id === 'gmail');
  const saved = url.searchParams.get('saved');
  const cards = [
    ...carriers.map((provider) => renderCredentialCard({
      provider,
      kind: 'carriers',
      callbackUrl: `${config.appBaseUrl}/api/auth/${provider.id}/callback`,
      note: 'Create a UPS developer app and register this callback URL before connecting a real UPS account.',
    })),
    ...emailProviders.map((provider) => renderCredentialCard({
      provider,
      kind: 'emailProviders',
      callbackUrl: `${config.appBaseUrl}/api/email/auth/${provider.id}/callback`,
      note: 'Google OAuth redirect URIs must match exactly. Raw LAN IP redirect URIs are not accepted by Google; use HTTPS on a real domain/tunnel or localhost for local web testing.',
    })),
  ].join('');

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Allio OAuth Setup</title>
        <style>
          body { margin: 0; background: #f7f8fb; color: #111827; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          main { max-width: 760px; margin: 0 auto; padding: 24px; }
          h1 { margin: 0 0 8px; font-size: 28px; }
          p { color: #5f6b7a; line-height: 1.45; }
          .notice, .card { border: 1px solid #e5e7eb; background: #fff; border-radius: 14px; padding: 16px; margin: 14px 0; }
          .saved { color: #14754c; font-weight: 800; }
          .ok { color: #14754c; font-weight: 800; }
          .warn { color: #b45309; font-weight: 800; }
          .small { font-size: 13px; }
          code { background: #eef2ff; color: #273a89; padding: 2px 5px; border-radius: 5px; word-break: break-all; }
          form { display: grid; gap: 10px; margin-top: 12px; }
          label { display: grid; gap: 5px; font-size: 13px; font-weight: 800; }
          input { min-height: 42px; border: 1px solid #d1d5db; border-radius: 8px; padding: 0 10px; font: inherit; }
          button { min-height: 46px; border: 0; border-radius: 8px; background: #236c5e; color: #fff; font-weight: 900; }
        </style>
      </head>
      <body>
        <main>
          <h1>Allio OAuth Setup</h1>
          <p>Use this local backend page to add developer app credentials. After saving credentials, return to Allio and tap Refresh Linked Accounts, then Connect.</p>
          ${saved ? `<p class="saved">${escapeHtml(saved)} credentials saved. Restart the Connect flow from Allio.</p>` : ''}
          <div class="notice">
            <strong>Important:</strong>
            <p class="small">These are developer app credentials for Allio's backend, not your personal UPS or Gmail password. Users still sign in with UPS or Google in the provider's own OAuth page.</p>
          </div>
          ${cards}
        </main>
      </body>
    </html>
  `;
}

function getUserId(url) {
  const userId = url.searchParams.get('userId');

  if (!userId) {
    throw new Error('Missing userId.');
  }

  return userId;
}

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }

  const url = new URL(req.url, config.appBaseUrl);
  const path = url.pathname;

  try {
    if (req.method === 'GET' && path === '/health') {
      sendJson(res, 200, { ok: true, service: 'allio-backend' });
      return;
    }

    if (req.method === 'GET' && path === '/setup') {
      sendHtml(res, 200, renderSetupPage(url));
      return;
    }

    const setupMatch = path.match(/^\/api\/setup\/(carriers|emailProviders)\/([^/]+)$/);
    if (req.method === 'POST' && setupMatch) {
      const form = await readForm(req);
      await saveProviderCredentials(setupMatch[1], setupMatch[2], form);
      redirect(res, `/setup?saved=${encodeURIComponent(setupMatch[2].toUpperCase())}`);
      return;
    }

    if (req.method === 'GET' && path === '/api/carriers') {
      sendJson(res, 200, { carriers: listCarriers() });
      return;
    }

    if (req.method === 'GET' && path === '/api/email/providers') {
      sendJson(res, 200, { providers: listEmailProviders() });
      return;
    }

    const authStartMatch = path.match(/^\/api\/auth\/([^/]+)\/start$/);
    if (req.method === 'GET' && authStartMatch) {
      const providerId = authStartMatch[1];
      const userId = getUserId(url);
      redirect(res, await createAuthStartUrl(providerId, userId));
      return;
    }

    const devConnectMatch = path.match(/^\/dev\/connect\/([^/]+)$/);
    if (req.method === 'GET' && devConnectMatch) {
      const providerId = devConnectMatch[1];
      const state = url.searchParams.get('state');
      await completeOAuth(providerId, state, `dev-code-${providerId}`);
      sendHtml(res, 200, `<h1>${providerId.toUpperCase()} connected</h1><p>You can return to Allio.</p>`);
      return;
    }

    const emailAuthStartMatch = path.match(/^\/api\/email\/auth\/([^/]+)\/start$/);
    if (req.method === 'GET' && emailAuthStartMatch) {
      const providerId = emailAuthStartMatch[1];
      const userId = getUserId(url);
      redirect(res, await createEmailAuthStartUrl(providerId, userId));
      return;
    }

    const devEmailConnectMatch = path.match(/^\/dev\/email\/connect\/([^/]+)$/);
    if (req.method === 'GET' && devEmailConnectMatch) {
      const providerId = devEmailConnectMatch[1];
      const state = url.searchParams.get('state');
      await completeEmailOAuth(providerId, state, `dev-email-code-${providerId}`);
      sendHtml(res, 200, `<h1>${providerId.toUpperCase()} email connected</h1><p>You can return to Allio.</p>`);
      return;
    }

    const emailCallbackMatch = path.match(/^\/api\/email\/auth\/([^/]+)\/callback$/);
    if (req.method === 'GET' && emailCallbackMatch) {
      const providerId = emailCallbackMatch[1];
      const state = url.searchParams.get('state');
      const code = url.searchParams.get('code');
      await completeEmailOAuth(providerId, state, code);
      redirect(res, `${config.mobileDeepLink}?provider=${encodeURIComponent(providerId)}&kind=email&status=connected`);
      return;
    }

    const callbackMatch = path.match(/^\/api\/auth\/([^/]+)\/callback$/);
    if (req.method === 'GET' && callbackMatch) {
      const providerId = callbackMatch[1];
      const state = url.searchParams.get('state');
      const code = url.searchParams.get('code');
      await completeOAuth(providerId, state, code);
      redirect(res, `${config.mobileDeepLink}?provider=${encodeURIComponent(providerId)}&status=connected`);
      return;
    }

    const connectionMatch = path.match(/^\/api\/users\/([^/]+)\/connections$/);
    if (req.method === 'GET' && connectionMatch) {
      sendJson(res, 200, { connections: await listConnections(connectionMatch[1]) });
      return;
    }

    const deleteConnectionMatch = path.match(/^\/api\/users\/([^/]+)\/connections\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteConnectionMatch) {
      await deleteConnection(deleteConnectionMatch[1], deleteConnectionMatch[2]);
      sendJson(res, 200, { ok: true });
      return;
    }

    const trackingMatch = path.match(/^\/api\/users\/([^/]+)\/trackings$/);
    if (req.method === 'GET' && trackingMatch) {
      const providerId = url.searchParams.get('provider');
      const trackingNumber = url.searchParams.get('trackingNumber');
      const connections = await listConnections(trackingMatch[1]);

      if (!providerId || !connections[providerId]) {
        sendJson(res, 409, { error: 'Carrier account is not connected for this user.' });
        return;
      }

      sendJson(res, 200, {
        shipment: createTrackingResponse(providerId, trackingNumber),
      });
      return;
    }

    const emailInboxMatch = path.match(/^\/api\/users\/([^/]+)\/emails$/);
    if (req.method === 'GET' && emailInboxMatch) {
      sendJson(res, 200, { messages: await listEmailInbox(emailInboxMatch[1]) });
      return;
    }

    sendJson(res, 404, { error: 'Route not found.' });
  } catch (err) {
    sendJson(res, 400, { error: err.message });
  }
}

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(config.port, config.host, () => {
  console.log(`Allio backend listening on ${config.appBaseUrl}`);
});
