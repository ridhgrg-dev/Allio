import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialLinkedAccounts } from './accountLinkService';

const LINKED_ACCOUNTS_KEY = '@allio/linkedAccounts';
const DELIVERY_HISTORY_KEY = '@allio/deliveryHistory';
const DELIVERY_ACCOUNT_KEY = '@allio/deliveryAccount';

async function readJson(key, fallback) {
  const value = await AsyncStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

async function writeJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  return value;
}

export async function loadLinkedAccounts() {
  const saved = await readJson(LINKED_ACCOUNTS_KEY, {});
  return {
    ...initialLinkedAccounts,
    ...saved,
  };
}

export async function saveLinkedAccounts(accounts) {
  return writeJson(LINKED_ACCOUNTS_KEY, accounts);
}

export async function loadDeliveryHistory() {
  return readJson(DELIVERY_HISTORY_KEY, []);
}

export async function saveDeliveryHistory(history) {
  return writeJson(DELIVERY_HISTORY_KEY, history);
}

export function upsertShipmentHistory(history, shipment) {
  const existing = history.find((item) => item.trackingNumber === shipment.trackingNumber);
  const favorite = existing?.favorite || false;
  const nextItem = {
    trackingNumber: shipment.trackingNumber,
    carrier: shipment.carrier,
    status: shipment.status,
    estimatedDelivery: shipment.estimatedDelivery,
    favorite,
    lastCheckedAt: new Date().toISOString(),
  };

  return [nextItem, ...history.filter((item) => item.trackingNumber !== shipment.trackingNumber)].slice(0, 25);
}

export function toggleShipmentFavorite(history, trackingNumber) {
  return history.map((item) => {
    if (item.trackingNumber !== trackingNumber) {
      return item;
    }

    return {
      ...item,
      favorite: !item.favorite,
    };
  });
}

export async function loadDeliveryAccount() {
  return readJson(DELIVERY_ACCOUNT_KEY, {
    provider: 'aftership',
    apiKey: '',
    connectedAt: null,
  });
}

export async function saveDeliveryAccount(account) {
  return writeJson(DELIVERY_ACCOUNT_KEY, account);
}

export async function clearDeliveryAccount() {
  await AsyncStorage.removeItem(DELIVERY_ACCOUNT_KEY);
  return {
    provider: 'aftership',
    apiKey: '',
    connectedAt: null,
  };
}
