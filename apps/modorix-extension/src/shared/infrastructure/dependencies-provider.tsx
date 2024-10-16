import { DependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { UserSessionStorage } from '@modorix/commons';
import { useState } from 'react';
import { dependencies } from '../../dependencies';

const defaultDependencies = {
  userSessionStorage: dependencies.userSessionStorage,
};

const DependenciesProvider = ({ children }: { children: React.ReactNode }) => {
  const [dependencies] = useState<{ userSessionStorage: UserSessionStorage }>(defaultDependencies);

  return <DependenciesContext.Provider value={{ dependencies }}>{children}</DependenciesContext.Provider>;
};

export { DependenciesProvider };
