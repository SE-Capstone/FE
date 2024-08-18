const ENDPOINT_QUERIES = {} as const;

const ENDPOINT_MUTATIONS = {
  signIn: 'user/auth',
  signUp: 'signup',
  resetPassword: 'reset-password',
  logout: 'user/logout',
  changePassword: 'change-password',
} as const;

export const AUTH_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
