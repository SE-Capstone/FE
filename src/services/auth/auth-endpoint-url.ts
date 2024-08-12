const ENDPOINT_QUERIES = {
  currentUserInfo: 'current-user-info',
} as const;

const ENDPOINT_MUTATIONS = {
  signIn: 'account/auth',
  signUp: 'signup',
  resetPassword: 'reset-password',
  logout: 'logout',
  changePassword: 'change-password',
} as const;

export const AUTH_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
