const mockUpdates = [
  {
    time: 'Today, 9:20 AM',
    location: 'Regional sorting center',
    detail: 'Package scanned and loaded for the next route.',
  },
  {
    time: 'Yesterday, 6:45 PM',
    location: 'Carrier facility',
    detail: 'Shipment arrived at carrier facility.',
  },
  {
    time: 'Yesterday, 11:05 AM',
    location: 'Origin hub',
    detail: 'Label created and package received.',
  },
];

const AFTERSHIP_TRACKINGS_URL = 'https://api.aftership.com/tracking/2024-07/trackings';

function normalizeTrackingNumber(trackingNumber) {
  return String(trackingNumber || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .toUpperCase();
}

function mapAfterShipTracking(item) {
  const trackingNumber = item.tracking_number || item.trackingNumber || item.id || 'UNKNOWN';
  const checkpoints = item.checkpoints || item.tracking?.checkpoints || [];
  const latestCheckpoint = checkpoints[checkpoints.length - 1];

  return {
    trackingNumber,
    carrier: item.slug || item.courier || item.courier_name || 'AfterShip',
    status: item.tag || item.subtag_message || item.delivery_status || 'Tracking',
    estimatedDelivery: item.expected_delivery || item.estimated_delivery_date || 'Not available',
    updates: checkpoints.length
      ? checkpoints.slice(-5).reverse().map((checkpoint) => ({
          time: checkpoint.checkpoint_time || checkpoint.created_at || 'Recent update',
          location: checkpoint.location || checkpoint.city || 'Carrier network',
          detail: checkpoint.message || checkpoint.checkpoint_message || checkpoint.tag || 'Shipment update received.',
        }))
      : [
          {
            time: latestCheckpoint?.checkpoint_time || 'Synced now',
            location: latestCheckpoint?.location || 'AfterShip',
            detail: latestCheckpoint?.message || 'Tracking exists in your AfterShip account.',
          },
        ],
  };
}

export async function trackPackage(trackingNumber) {
  const normalized = normalizeTrackingNumber(trackingNumber);

  if (!normalized) {
    throw new Error('Enter a tracking number.');
  }

  if (normalized.length < 5) {
    throw new Error('Tracking number looks too short.');
  }

  if (!/^[A-Z0-9]+$/.test(normalized)) {
    throw new Error('Use only letters and numbers for now.');
  }

  // Future integration point: call AfterShip/EasyPost here and map carrier events
  // into this stable app-level shape.
  return {
    trackingNumber: normalized,
    carrier: 'Allio Mock Carrier',
    status: 'In transit',
    estimatedDelivery: 'May 8, 2026',
    updates: mockUpdates,
  };
}

export async function syncAfterShipTrackings(apiKey) {
  const trimmedKey = String(apiKey || '').trim();

  if (!trimmedKey) {
    throw new Error('Add an AfterShip API key first.');
  }

  const response = await fetch(`${AFTERSHIP_TRACKINGS_URL}?limit=10`, {
    method: 'GET',
    headers: {
      'as-api-key': trimmedKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('AfterShip sync failed. Check your API key and tracking permissions.');
  }

  const data = await response.json();
  const rawTrackings = data.data?.trackings || data.trackings || data.data || [];

  if (!Array.isArray(rawTrackings)) {
    throw new Error('AfterShip returned an unexpected response.');
  }

  return rawTrackings.map(mapAfterShipTracking);
}
