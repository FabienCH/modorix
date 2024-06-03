import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { getBlockedUsers } from '../gateways/block-user-gateway';

const columns = ['X username', 'Blocked on'];

export const XUsersTable = () => {
  const [blockedUsersData, setBlockedUsersData] = useState<string[][]>([]);

  useEffect(() => {
    refreshBlockedUsersList();
  }, []);

  async function refreshBlockedUsersList() {
    const blockedUsers = await getBlockedUsers();
    const blockedUserData = blockedUsers.map((user) => [user.id, new Date(user.blockedAt).toLocaleDateString()]);
    setBlockedUsersData(blockedUserData);
  }
  return (
    <ModorixTable columns={columns} data={blockedUsersData} emptyDataMessage="You haven't blocked any user with Modorix yet"></ModorixTable>
  );
};
