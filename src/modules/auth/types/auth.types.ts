export interface IAuthUserLoginResponse {
  userId: string;
  roleId: string;
  roleName: string;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthLogoutResponse {
  isLoggedOut: boolean;
}
