import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserSessionInfos } from '../domain/login/models/user-session';

const defaultUserSessionInfos = {
  hasValidAccessToken: false,
  userEmail: null,
};

const UserSessionContext = createContext<{
  userSessionInfos: UserSessionInfos;
  setUserSessionInfos: Dispatch<SetStateAction<UserSessionInfos>>;
}>({ userSessionInfos: defaultUserSessionInfos, setUserSessionInfos: () => {} });

const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSessionInfos, setUserSessionInfos] = useState<UserSessionInfos>(defaultUserSessionInfos);

  return <UserSessionContext.Provider value={{ userSessionInfos, setUserSessionInfos }}>{children}</UserSessionContext.Provider>;
};

const useUserSessionInfos = () => {
  return useContext(UserSessionContext);
};

export { UserSessionProvider, useUserSessionInfos };
