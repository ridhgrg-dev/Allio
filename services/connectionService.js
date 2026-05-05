import { initialLinkedAccounts, serviceGroups } from './accountLinkService';

export const connectionGroups = [
  {
    id: 'delivery',
    title: 'Delivery services',
    description: 'Prepare Allio to unify package updates from carriers and shipment APIs.',
    providers: [
      ...serviceGroups.delivery.providers.map((provider) => ({ ...provider, status: 'available' })),
    ],
  },
  {
    id: 'knowledge',
    title: 'Wikipedia account',
    description: 'Save research preferences and prepare for account-aware reading features.',
    providers: serviceGroups.wikipedia.providers.map((provider) => ({ ...provider, status: 'available' })),
  },
  {
    id: 'media',
    title: 'Movie and TV accounts',
    description: 'Create a future home for watchlists, ratings, and streaming availability.',
    providers: serviceGroups.media.providers.map((provider) => ({ ...provider, status: 'available' })),
  },
  {
    id: 'email',
    title: 'Email accounts',
    description: 'Keep the MVP manual while reserving a clean path to OAuth providers.',
    providers: serviceGroups.email.providers.map((provider) => ({ ...provider, status: 'available' })),
  },
];

export function createInitialConnections() {
  return initialLinkedAccounts;
}
