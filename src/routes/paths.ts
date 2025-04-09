export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
  } as const;
  
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];