import { Linking } from 'react-native';
import { getOrCreateAllioUserId } from './storageService';

export const ALLIO_API_URL = process.env.EXPO_PUBLIC_ALLIO_API_URL || '';

export function isBackendConfigured() {
  return Boolean(ALLIO_API_URL);
}

async function request(path, options) {
  if (!ALLIO_API_URL) {
    throw new Error('Backend is not configured.');
  }

  const response = await fetch(`${ALLIO_API_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Allio backend request failed.');
  }

  return data;
}

export async function startCarrierConnection(providerId) {
  const userId = await getOrCreateAllioUserId();

  if (!ALLIO_API_URL) {
    return false;
  }

  const url = `${ALLIO_API_URL}/api/auth/${providerId}/start?userId=${encodeURIComponent(userId)}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Unable to open Allio backend connection page.');
  }

  await Linking.openURL(url);
  return true;
}

export async function startEmailConnection(providerId) {
  const userId = await getOrCreateAllioUserId();

  if (!ALLIO_API_URL) {
    return false;
  }

  const url = `${ALLIO_API_URL}/api/email/auth/${providerId}/start?userId=${encodeURIComponent(userId)}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Unable to open Allio backend email connection page.');
  }

  await Linking.openURL(url);
  return true;
}

export async function loadBackendConnections() {
  const userId = await getOrCreateAllioUserId();
  return request(`/api/users/${encodeURIComponent(userId)}/connections`);
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
