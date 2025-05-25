export const ROUTES = {
    AGENDA: '/',
    LOGIN: '/login',
    PROFILE: '/profile',
    SELLER: '/seller',
    SELLERDETAILS: ':id',
    NEWSELLER: 'new',
    PROPERTY: '/property',
    PROPERTYDETAILS: ':id',
    NEWPROPERTY: 'new',
    VISIT: '/visit',
    VISITDETAILS: ':id',
    NEWVISIT: 'new',
    ASESOR: '/asesor',
    ASESORDETAILS: ':id',
    NEWASESOR: 'new',
    ERROR: '/error',
  } as const;
  
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];