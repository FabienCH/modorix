import { Group } from '@modorix-commons//domain/models/group';
import { showErrorToast } from '@modorix-commons/components/show-error-toast';
import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { UserSessionStorage } from '@modorix/commons';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getGroups } from '../adapters/gateways/group-gateway';
import MembershipButton from '../components/groups/membership-button';
import { toggleMembership } from '../domain/group/toggle-group-membership-usecase';
import { ROUTES } from '../routes';

const defaultColumns = ['Group', 'Description', 'Blocked Users'];

export default function GroupsPage() {
  const [groupsData, setGroupsData] = useState<(string | JSX.Element)[][]>([]);
  const { dependencies } = useDependenciesContext();
  const { userSessionInfos, setUserSessionInfos } = useUserSessionInfos();
  const columns = defaultColumns;

  const handleClick = useCallback(
    async (group: Group) => {
      await toggleMembership(group, showErrorToast, { ...dependencies.userSessionStorage, setUserSessionInfos });
      await retrieveGroupsList(handleClick, !!userSessionInfos?.hasValidAccessToken, dependencies.userSessionStorage);
    },
    [dependencies, setUserSessionInfos, userSessionInfos],
  );

  useEffect(() => {
    retrieveGroupsList(handleClick, !!userSessionInfos?.hasValidAccessToken, dependencies.userSessionStorage);
    if (userSessionInfos?.hasValidAccessToken && columns.length === 3) {
      columns.push('Membership');
    }
  }, [dependencies, handleClick, userSessionInfos, columns]);

  async function retrieveGroupsList(
    handleClickFn: (group: Group) => Promise<void>,
    hasValidAccessToken: boolean,
    userSessionStorage: UserSessionStorage,
  ) {
    const groups = await getGroups(userSessionStorage.getAccessToken);
    const groupsData = groups.map((group) => {
      const rowData = [
        <NavLink to={`${ROUTES.Groups}/${group.id}`}>{group.name}</NavLink>,
        group.description,
        group.blockedXUserIds.length.toString(),
      ];
      if (hasValidAccessToken) {
        rowData.push(<MembershipButton group={group} size={'sm'} onClick={() => handleClickFn(group)} />);
      }

      return rowData;
    });
    setGroupsData(groupsData);
  }

  return (
    <section className="w-full mx-auto max-w-screen-lg">
      <h1 className="main-title">Groups</h1>
      <ModorixTable columns={columns} data={groupsData} emptyDataMessage="There is no groups yet"></ModorixTable>
    </section>
  );
}
