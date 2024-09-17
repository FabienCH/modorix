export interface UserSession {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface UserSessionInfos {
  hasValidAccessToken: boolean;
  userEmail: string | null;
}
