import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { getBlockedUsers } from '../gateways/block-user-gateway';

const columns = ['X Username', 'Blocked On'];

export const XUsersTable = ({ className }: { className?: string }) => {
  const [blockedUsersData, setBlockedUsersData] = useState<string[][]>([]);

  useEffect(() => {
    retrieveBlockedUsersList();
  }, []);

  async function retrieveBlockedUsersList() {
    const blockedUsers = await getBlockedUsers();
    const blockedUserData = blockedUsers.map((user) => [user.id, new Date(user.blockedAt).toLocaleDateString()]);
    setBlockedUsersData(blockedUserData);
  }

  return (
    <ModorixTable
      className={className}
      columns={columns}
      data={blockedUsersData}
      emptyDataMessage="You haven't blocked any user with Modorix yet"
    ></ModorixTable>
  );
};
