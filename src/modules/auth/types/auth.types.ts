export interface IAuthUserLoginResponse {
  userId: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthLogoutResponse {
  isLoggedOut: boolean;
}
