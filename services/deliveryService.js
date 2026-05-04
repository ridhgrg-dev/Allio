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

export async function trackPackage(trackingNumber) {
  const normalized = trackingNumber.trim().toUpperCase();

  if (!normalized) {
    throw new Error('Enter a tracking number.');
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
