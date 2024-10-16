import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserSessionInfos } from '../domain/login/models/user-session';

const UserSessionContext = createContext<{
  userSessionInfos: UserSessionInfos | null;
  setUserSessionInfos: Dispatch<SetStateAction<UserSessionInfos | null>>;
}>({ userSessionInfos: null, setUserSessionInfos: () => {} });

const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSessionInfos, setUserSessionInfos] = useState<UserSessionInfos | null>(null);

  return <UserSessionContext.Provider value={{ userSessionInfos, setUserSessionInfos }}>{children}</UserSessionContext.Provider>;
};

const useUserSessionInfos = () => {
  return useContext(UserSessionContext);
};

export { UserSessionProvider, useUserSessionInfos };
