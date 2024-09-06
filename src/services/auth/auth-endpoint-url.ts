const ENDPOINT_QUERIES = {} as const;

const ENDPOINT_MUTATIONS = {
  googleSignIn: 'auth/google-login',
  signIn: 'auth/login',
  signUp: 'auth/register',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  logout: 'auth/logout',
  changePassword: 'auth/change-password',
  adminChangePassword: 'auth/admin-change-password',
  checkResetCode: 'auth/check-code',
} as const;

export const AUTH_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
