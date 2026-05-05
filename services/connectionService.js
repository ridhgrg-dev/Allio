export const connectionGroups = [
  {
    id: 'delivery',
    title: 'Delivery services',
    description: 'Prepare Allio to unify package updates from carriers and shipment APIs.',
    providers: [
      { id: 'ups', name: 'UPS', status: 'available' },
      { id: 'fedex', name: 'FedEx', status: 'available' },
      { id: 'usps', name: 'USPS', status: 'available' },
      { id: 'dhl', name: 'DHL', status: 'available' },
      { id: 'aftership', name: 'AfterShip', status: 'planned' },
      { id: 'easypost', name: 'EasyPost', status: 'planned' },
    ],
  },
  {
    id: 'knowledge',
    title: 'Wikipedia account',
    description: 'Save research preferences and prepare for account-aware reading features.',
    providers: [
      { id: 'wikimedia', name: 'Wikimedia', status: 'available' },
      { id: 'wikipedia', name: 'Wikipedia', status: 'available' },
    ],
  },
  {
    id: 'media',
    title: 'Movie and TV accounts',
    description: 'Create a future home for watchlists, ratings, and streaming availability.',
    providers: [
      { id: 'tmdb', name: 'TMDB', status: 'available' },
      { id: 'netflix', name: 'Netflix', status: 'planned' },
      { id: 'hulu', name: 'Hulu', status: 'planned' },
      { id: 'disney', name: 'Disney+', status: 'planned' },
      { id: 'prime', name: 'Prime Video', status: 'planned' },
    ],
  },
  {
    id: 'email',
    title: 'Email accounts',
    description: 'Keep the MVP manual while reserving a clean path to OAuth providers.',
    providers: [
      { id: 'gmail', name: 'Gmail', status: 'available' },
      { id: 'outlook', name: 'Outlook', status: 'available' },
      { id: 'icloud', name: 'iCloud Mail', status: 'planned' },
      { id: 'yahoo', name: 'Yahoo Mail', status: 'planned' },
    ],
  },
];

export function createInitialConnections() {
  return {
    wikimedia: true,
    tmdb: true,
  };
}
