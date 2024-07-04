import { Group } from '@modorix-commons/models/group';
import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getGroups } from '../adapters/gateways/group-gateway';
import MembershipButton from '../components/membership-button';
import { toggleMembership } from '../domain/toggle-group-membership-usecase';
import { ROUTES } from '../routes';

const columns = ['Group', 'Description', 'Blocked Users', 'Membership'];

export default function GroupsPage() {
  const [groupsData, setGroupsData] = useState<(string | JSX.Element)[][]>([]);

  const handleClick = useCallback(async (group: Group) => {
    await toggleMembership(group);
    await retrieveGroupsList(handleClick);
  }, []);

  useEffect(() => {
    retrieveGroupsList(handleClick);
  }, [handleClick]);

  async function retrieveGroupsList(handleClickFn: (group: Group) => Promise<void>) {
    const groups = await getGroups();
    const groupsData = groups.map((group) => [
      <NavLink to={`${ROUTES.Groups}/${group.id}`}>{group.name}</NavLink>,
      group.description,
      group.blockedXUserIds.length.toString(),
      <MembershipButton group={group} size={'sm'} onClick={() => handleClickFn(group)} />,
    ]);
    setGroupsData(groupsData);
  }

  return (
    <section className="w-full mx-auto max-w-screen-lg">
      <h1 className="main-title">Groups</h1>
      <ModorixTable columns={columns} data={groupsData} emptyDataMessage="There is no groups yet"></ModorixTable>
    </section>
  );
}
