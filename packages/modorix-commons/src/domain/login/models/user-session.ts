export interface UserSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
}

export interface UserSessionInfos {
  hasValidAccessToken: boolean;
  userEmail: string;
  userId: string;
}
