import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const dataDir = path.resolve(process.cwd(), 'data');
const credentialsPath = path.join(dataDir, 'provider-credentials.json');

const emptyCredentials = {
  carriers: {},
  emailProviders: {},
};

function readCredentialsFile() {
  if (!fs.existsSync(credentialsPath)) {
    return emptyCredentials;
  }

  try {
    return {
      ...emptyCredentials,
      ...JSON.parse(fs.readFileSync(credentialsPath, 'utf8')),
    };
  } catch (err) {
    return emptyCredentials;
  }
}

function normalizeCredentialValue(value) {
  const trimmed = String(value || '').trim();
  return trimmed || undefined;
}

export function mergeProviderCredentials(baseProviders, kind, allowLocalOverrides = false) {
  if (!allowLocalOverrides) {
    return baseProviders;
  }

  const credentials = readCredentialsFile()[kind] || {};

  return Object.fromEntries(
    Object.entries(baseProviders).map(([providerId, provider]) => [
      providerId,
      {
        ...provider,
        ...(credentials[providerId] || {}),
      },
    ]),
  );
}

export function listProviderCredentialStatus(baseProviders, kind, allowLocalOverrides = false) {
  const providers = mergeProviderCredentials(baseProviders, kind, allowLocalOverrides);

  return Object.entries(providers).map(([id, provider]) => ({
    id,
    name: provider.name,
    configured: Boolean(provider.clientId && provider.clientSecret && provider.authUrl && provider.tokenUrl),
    mode: provider.clientId && provider.clientSecret ? 'oauth' : 'unconfigured',
    authUrl: provider.authUrl || null,
    tokenUrl: provider.tokenUrl || null,
    callbackUrl: provider.callbackUrl || null,
  }));
}

export async function saveProviderCredentials(kind, providerId, values) {
  await fsp.mkdir(dataDir, { recursive: true });
  const credentials = readCredentialsFile();
  credentials[kind] ||= {};
  credentials[kind][providerId] = {
    ...(credentials[kind][providerId] || {}),
    clientId: normalizeCredentialValue(values.clientId),
    clientSecret: normalizeCredentialValue(values.clientSecret),
    authUrl: normalizeCredentialValue(values.authUrl),
    tokenUrl: normalizeCredentialValue(values.tokenUrl),
  };

  await fsp.writeFile(credentialsPath, JSON.stringify(credentials, null, 2));
  return credentials[kind][providerId];
}
