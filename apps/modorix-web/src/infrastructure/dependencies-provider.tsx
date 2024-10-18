import { DependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { UserSessionStorage } from '@modorix/commons';
import { useState } from 'react';
import { dependencies } from './dependencies';

const DependenciesProvider = ({ children }: { children: React.ReactNode }) => {
  const [deps] = useState<{ userSessionStorage: UserSessionStorage }>(dependencies);

  return <DependenciesContext.Provider value={{ dependencies: deps }}>{children}</DependenciesContext.Provider>;
};

export { DependenciesProvider };
