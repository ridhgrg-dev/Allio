import { initialLinkedAccounts, serviceGroups } from './accountLinkService';

export const connectionGroups = [
  {
    id: 'delivery',
    title: 'Delivery services',
    description: 'Carrier account sync is planned after provider approval. Gmail tracking extraction is first.',
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
    description: 'Connect Gmail to let Allio read shipping emails and extract tracking numbers.',
    providers: serviceGroups.email.providers.map((provider) => ({ ...provider, status: 'available' })),
  },
];

export function createInitialConnections() {
  return initialLinkedAccounts;
}
