import http from 'node:http';
import { URL } from 'node:url';
import { config } from './config.js';
import { completeOAuth, createAuthStartUrl, createTrackingResponse, listCarriers } from './carriers.js';
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

    if (req.method === 'GET' && path === '/api/carriers') {
      sendJson(res, 200, { carriers: listCarriers() });
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
