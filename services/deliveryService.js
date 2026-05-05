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

function normalizeTrackingNumber(trackingNumber) {
  return String(trackingNumber || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .toUpperCase();
}

export async function trackPackage(trackingNumber, options = {}) {
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
    carrier: options.preferredCarrier || 'Linked carrier account',
    status: 'In transit',
    estimatedDelivery: 'May 8, 2026',
    updates: mockUpdates,
  };
}
