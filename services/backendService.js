import { Linking } from 'react-native';
import { getOrCreateAllioUserId, loadBackendUrl } from './storageService';

const LOCAL_DEV_ALLIO_API_URL = 'http://192.168.8.142:4100';
const RETIRED_LOCAL_DEV_URLS = ['http://192.168.1.166:4100'];
const ENV_ALLIO_API_URL = process.env.EXPO_PUBLIC_ALLIO_API_URL || LOCAL_DEV_ALLIO_API_URL;

export async function getBackendBaseUrl() {
  const savedUrl = await loadBackendUrl();
  if (RETIRED_LOCAL_DEV_URLS.includes(savedUrl)) {
    return ENV_ALLIO_API_URL;
  }

  return savedUrl || ENV_ALLIO_API_URL;
}

export async function isBackendConfigured() {
  return Boolean(await getBackendBaseUrl());
}

async function request(path, options) {
  const backendUrl = await getBackendBaseUrl();

  if (!backendUrl) {
    throw new Error('Backend is not configured.');
  }

  let response;

  try {
    response = await fetch(`${backendUrl}${path}`, options);
  } catch (err) {
    throw new Error('Allio backend is not reachable. Check the URL in Settings.');
  }

  let data;

  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Allio backend returned an unreadable response.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Allio backend request failed.');
  }

  return data;
}

export async function startCarrierConnection(providerId) {
  const userId = await getOrCreateAllioUserId();
  const backendUrl = await getBackendBaseUrl();

  if (!backendUrl) {
    return false;
  }

  const url = `${backendUrl}/api/auth/${providerId}/start?userId=${encodeURIComponent(userId)}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Unable to open Allio backend connection page.');
  }

  await Linking.openURL(url);
  return true;
}

export async function startEmailConnection(providerId) {
  const userId = await getOrCreateAllioUserId();
  const backendUrl = await getBackendBaseUrl();

  if (!backendUrl) {
    return false;
  }

  const url = `${backendUrl}/api/email/auth/${providerId}/start?userId=${encodeURIComponent(userId)}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Unable to open Allio backend email connection page.');
  }

  await Linking.openURL(url);
  return true;
}

export async function openDeveloperOAuthSetup() {
  const backendUrl = await getBackendBaseUrl();

  if (!backendUrl) {
    return false;
  }

  const url = `${backendUrl}/setup`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Unable to open Gmail setup page.');
  }

  await Linking.openURL(url);
  return true;
}

export async function loadBackendConnections() {
  const userId = await getOrCreateAllioUserId();
  return request(`/api/users/${encodeURIComponent(userId)}/connections`);
}

export async function loadBackendProviderStatus() {
  const [carrierData, emailData] = await Promise.all([
    request('/api/carriers'),
    request('/api/email/providers'),
  ]);

  return {
    carriers: carrierData.carriers || [],
    emailProviders: emailData.providers || [],
  };
}

export async function disconnectBackendConnection(providerId) {
  const userId = await getOrCreateAllioUserId();
  return request(`/api/users/${encodeURIComponent(userId)}/connections/${encodeURIComponent(providerId)}`, {
    method: 'DELETE',
  });
}

export async function trackWithBackendCarrier(providerId, trackingNumber) {
  const userId = await getOrCreateAllioUserId();
  const params = new URLSearchParams({
    provider: providerId,
    trackingNumber,
  });
  const data = await request(`/api/users/${encodeURIComponent(userId)}/trackings?${params.toString()}`);
  return data.shipment;
}

export async function loadBackendEmailInbox() {
  const userId = await getOrCreateAllioUserId();
  const data = await request(`/api/users/${encodeURIComponent(userId)}/emails`);
  return data.messages;
}

export async function checkBackendHealth() {
  return request('/health');
}
