import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserSessionInfos } from '../domain/login/models/user-session';

const UserSessionContext = createContext<{
  userSessionInfos: UserSessionInfos | null;
  setUserSessionInfos: Dispatch<SetStateAction<UserSessionInfos | null>>;
  removeUserSessionInfos: Dispatch<SetStateAction<void>>;
}>({ userSessionInfos: null, setUserSessionInfos: () => {}, removeUserSessionInfos: () => {} });

const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSessionInfos, setUserSessionInfos] = useState<UserSessionInfos | null>(null);

  function removeUserSessionInfos() {
    setUserSessionInfos(null);
  }

  return (
    <UserSessionContext.Provider value={{ userSessionInfos, setUserSessionInfos, removeUserSessionInfos }}>
      {children}
    </UserSessionContext.Provider>
  );
};

const useUserSessionInfos = () => {
  return useContext(UserSessionContext);
};

export { UserSessionProvider, useUserSessionInfos };
