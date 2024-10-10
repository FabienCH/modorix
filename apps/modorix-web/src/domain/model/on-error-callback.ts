import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionInfos } from '@modorix/commons';

export type OnErrorCallback = (
  title: string,
  error: AuthError['error'],
  setUserSessionInfos: (userSessionInfos: UserSessionInfos | null) => void,
) => void;
