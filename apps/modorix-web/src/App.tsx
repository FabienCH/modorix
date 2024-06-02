import { ModorixTable } from '@modorix-ui/components/modorix-table';
import '@modorix-ui/globals.css';
import { useEffect, useState } from 'react';
import Header from './Header';
import { getBlockedUsers } from './adapters/gateways/block-user-gateway';

const columns = ['X username', 'Blocked on'];

export default function App() {
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
      <Header />
      <section className="mx-auto max-w-screen-sm p-3">
        <h1 className="flex items-center text-xl py-3 text-modorix-950">Your Modorix blocked users</h1>
        <ModorixTable
          columns={columns}
          data={blockedUsersData}
          emptyDataMessage="You haven't blocked any user with Modorix yet"
        ></ModorixTable>
      </section>
    </>
  );
}
