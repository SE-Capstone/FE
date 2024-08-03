export interface IAuthUserLogin {
  id: number;
  email: string;
  role: string;
}

export interface IAuthUserLoginResponse {
  user: IAuthUserLogin;
  accessToken: string;
  refreshToken: string;
  expiredAt: number;
}

export interface IAuthLogoutResponse {
  isLoggedOut: boolean;
}
