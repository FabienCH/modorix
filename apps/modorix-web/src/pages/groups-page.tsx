import { Group } from '@modorix-commons/models/group';
import { ModorixTable } from '@modorix-ui/components/modorix-table';
import '@modorix-ui/globals.css';
import { useCallback, useEffect, useState } from 'react';
import { getGroups } from '../adapters/gateways/group-gateway';
import MembershipCell from '../components/membership-cell';
import { toggleMemberShip } from '../domain/toggle-group-membership-usecase';

const columns = ['Group', 'Description', 'Membership'];

export default function GroupsPage() {
  const [groupsData, setGroupsData] = useState<(string | JSX.Element)[][]>([]);

  const handleClick = useCallback(async (group: Group) => {
    await toggleMemberShip(group);
    await retrieveGroupsList(handleClick);
  }, []);

  useEffect(() => {
    retrieveGroupsList(handleClick);
  }, [handleClick]);

  async function retrieveGroupsList(handleClickFn: (group: Group) => Promise<void>) {
    const groups = await getGroups();
    const groupsData = groups.map((group) => [
      group.name,
      group.description,
      <MembershipCell group={group} onClick={() => handleClickFn(group)} />,
    ]);
    setGroupsData(groupsData);
  }

  return (
    <>
      <h1 className="text-xl pb-3 text-modorix-950">Groups</h1>
      <ModorixTable columns={columns} data={groupsData} emptyDataMessage="There is no groups yet"></ModorixTable>
    </>
  );
}
