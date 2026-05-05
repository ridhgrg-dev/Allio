import { Linking } from 'react-native';

export const serviceGroups = {
  delivery: {
    title: 'Delivery accounts',
    icon: 'cube-outline',
    accent: '#0f766e',
    providers: [
      { id: 'ups', name: 'UPS', icon: 'archive-outline', url: 'https://www.ups.com/lasso/login' },
      { id: 'fedex', name: 'FedEx', icon: 'airplane-outline', url: 'https://www.fedex.com/secure-login/en-us/' },
      { id: 'usps', name: 'USPS', icon: 'mail-outline', url: 'https://reg.usps.com/' },
      { id: 'dhl', name: 'DHL', icon: 'flash-outline', url: 'https://mydhl.express.dhl/' },
    ],
  },
  wikipedia: {
    title: 'Knowledge accounts',
    icon: 'library-outline',
    accent: '#3155d4',
    providers: [
      { id: 'wikimedia', name: 'Wikimedia', icon: 'globe-outline', url: 'https://auth.wikimedia.org/' },
      { id: 'wikipedia', name: 'Wikipedia', icon: 'book-outline', url: 'https://en.wikipedia.org/w/index.php?title=Special:UserLogin' },
    ],
  },
  media: {
    title: 'Movie and TV accounts',
    icon: 'film-outline',
    accent: '#a855f7',
    providers: [
      { id: 'tmdb', name: 'TMDB', icon: 'star-outline', url: 'https://www.themoviedb.org/login' },
      { id: 'netflix', name: 'Netflix', icon: 'tv-outline', url: 'https://www.netflix.com/login' },
      { id: 'hulu', name: 'Hulu', icon: 'play-circle-outline', url: 'https://auth.hulu.com/web/login' },
      { id: 'disney', name: 'Disney+', icon: 'sparkles-outline', url: 'https://www.disneyplus.com/login' },
      { id: 'prime', name: 'Prime Video', icon: 'videocam-outline', url: 'https://www.primevideo.com/' },
    ],
  },
  email: {
    title: 'Email accounts',
    icon: 'mail-outline',
    accent: '#ea580c',
    providers: [
      { id: 'gmail', name: 'Gmail', icon: 'logo-google', url: 'https://accounts.google.com/' },
      { id: 'outlook', name: 'Outlook', icon: 'mail-unread-outline', url: 'https://login.live.com/' },
      { id: 'icloud', name: 'iCloud Mail', icon: 'cloud-outline', url: 'https://www.icloud.com/mail' },
      { id: 'yahoo', name: 'Yahoo Mail', icon: 'at-outline', url: 'https://login.yahoo.com/' },
    ],
  },
};

export const initialLinkedAccounts = {};

export async function openProviderSignIn(provider) {
  const canOpen = await Linking.canOpenURL(provider.url);

  if (!canOpen) {
    throw new Error(`Unable to open ${provider.name} sign in.`);
  }

  await Linking.openURL(provider.url);
}
