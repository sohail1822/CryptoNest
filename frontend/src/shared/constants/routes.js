export const ROUTES = Object.freeze({
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  market: '/market',
  holdings: '/holdings',
  watchlist: '/watchlist',
  history: '/history',
  news: '/news',
  profile: '/profile',
  intelligence: '/intelligence',
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
  coin: (coinId) => `/coin/${coinId}`,
  sell: (coinId) => `/dashboard/sell/${coinId}`,
});

export const ROUTE_PATTERNS = Object.freeze({
  coin: '/coin/:coinId',
  sell: '/dashboard/sell/:coinId',
});

export const AUTH_ROUTES = [ROUTES.login, ROUTES.signup];
