export const appSections = [
  {
    title: 'Delivery Tracking',
    description: 'Track packages manually, save favorites, and use linked carrier context.',
    route: 'Delivery',
    accent: '#0f766e',
    meta: '4 carrier options',
    icon: 'cube-outline',
    menuSubtitle: 'Packages, history, and favorites',
  },
  {
    title: 'Email',
    description: 'Check linked inbox signals, extract tracking numbers, and compose mock mail.',
    route: 'Email',
    accent: '#ea580c',
    meta: 'Inbox signals',
    icon: 'mail-outline',
    menuSubtitle: 'Inbox, tracking extraction, compose',
  },
  {
    title: 'Wikipedia Search',
    description: 'Search public Wikipedia pages and keep room for account-aware reading later.',
    route: 'Wikipedia',
    accent: '#3155d4',
    meta: 'Real search',
    icon: 'library-outline',
    menuSubtitle: 'Knowledge search',
  },
  {
    title: 'Movie/TV Search',
    description: 'Explore titles while the media account integrations stay on the roadmap.',
    route: 'Movies',
    accent: '#a855f7',
    meta: 'Media hub',
    icon: 'film-outline',
    menuSubtitle: 'Titles and watchlist foundation',
  },
  {
    title: 'Coming Soon',
    description: 'A place for future app and service connectors.',
    disabled: true,
    accent: '#94a3b8',
    meta: 'Roadmap',
    icon: 'sparkles-outline',
  },
];

export const menuSections = [
  { route: 'Home', icon: 'home-outline', title: 'Home', subtitle: 'Allio dashboard' },
  ...appSections
    .filter((section) => section.route)
    .map((section) => ({
      route: section.route,
      icon: section.icon,
      title: section.title,
      subtitle: section.menuSubtitle,
    })),
];
