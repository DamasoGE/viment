export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SELLER: '/seller',
    PROPERTY: '/property',
    VISIT: '/visit',
    ERROR: '/error'
  } as const;
  
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];