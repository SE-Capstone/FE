import type { ICurrentUserResponse } from '.';

export interface IAuthUserLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ICurrentUserResponse;
}

export interface IAuthLogoutResponse {
  isLoggedOut: boolean;
}
