import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { getBlockedUsers } from '../gateways/block-user-gateway';
import { BlockUserReasons } from './block-user-reasons';

const columns = ['X Username', 'Blocked On', 'Block Reasons'];

type XUserData = [string, string, JSX.Element][];

export const XUsersTable = () => {
  const [blockedUsersData, setBlockedUsersData] = useState<XUserData>([]);

  useEffect(() => {
    retrieveBlockedUsersList();
  }, []);

  async function retrieveBlockedUsersList() {
    const blockedUsers = await getBlockedUsers();
    const blockedUserData: XUserData = blockedUsers.map((user) => [
      user.id,
      new Date(user.blockedAt).toLocaleDateString(),
      <BlockUserReasons blockReasons={user.blockReasons}></BlockUserReasons>,
    ]);
    setBlockedUsersData(blockedUserData);
  }

  return (
    <ModorixTable
      rowClassName="grid grid-cols-[1fr_1fr_2fr] align-middle "
      columns={columns}
      data={blockedUsersData}
      emptyDataMessage="You haven't blocked any user with Modorix yet"
    ></ModorixTable>
  );
};
