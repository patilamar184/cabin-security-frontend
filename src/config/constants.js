export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  REGISTRATION: '/registration',
  VISITORS: '/visitors',
  PREVIOUS_ENTRIES: '/previous-entries',
  EDIT_REGISTRATION: '/edit-registration',
  DELETE_REGISTRATION: '/delete-registration',
  ACCOUNT: '/account',
};

export const ROLES = ['Employee', 'Visitor', 'Contractor'];

export const DEPARTMENTS = [
  'Engineering',
  'IT',
  'HR',
  'Operations',
  'Maintenance',
  'Administration',
  'Security',
  'Finance',
];

export const ACCESS_DURATIONS = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 30, label: '30 min' },
];

export const PAGE_SIZE = 10;
export const POLL_INTERVAL_MS = 10000;
export const TOKEN_KEY = 'cabin_security_token';
