export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SELLER: '/seller',
    NEWSELLER: 'new',
    PROPERTY: '/property',
    NEWPROPERTY: 'new',
    VISIT: '/visit',
    ERROR: '/error',
  } as const;
  
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];