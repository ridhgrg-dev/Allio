import { initialLinkedAccounts, serviceGroups } from './accountLinkService';

export const connectionGroups = [
  {
    id: 'email',
    title: 'Email account',
    description: 'Connect Gmail to let Allio read shipping emails and extract tracking numbers.',
    providers: serviceGroups.email.providers
      .filter((provider) => provider.id === 'gmail')
      .map((provider) => ({ ...provider, status: 'available' })),
  },
];

export function createInitialConnections() {
  return initialLinkedAccounts;
}
