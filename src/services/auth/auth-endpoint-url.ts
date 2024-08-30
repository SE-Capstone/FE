const ENDPOINT_QUERIES = {} as const;

const ENDPOINT_MUTATIONS = {
  signIn: 'auth/login',
  signUp: 'auth/register',
  resetPassword: 'auth/reset-password',
  logout: 'auth/logout',
  changePassword: 'auth/change-password',
  adminChangePassword: 'auth/admin-change-password',
} as const;

export const AUTH_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
