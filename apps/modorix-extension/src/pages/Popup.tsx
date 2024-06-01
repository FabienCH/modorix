import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { getBlockedUsers } from '../background/block-user-gateway';

const columns = ['X username', 'Blocked on'];

export default function Popup() {
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
    <>
      <h1 className="flex items-center text-xl p-2 border-b text-modorix-950 bg-white">
        <img src="/icon/48.png" className="w-7 mr-1.5" />
        Your Modorix blocked users
      </h1>
      <div className="p-4">
        <ModorixTable
          columns={columns}
          data={blockedUsersData}
          emptyDataMessage="You haven't blocked any user with Modorix yet"
        ></ModorixTable>
      </div>
    </>
  );
}
