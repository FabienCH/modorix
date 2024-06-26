import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { getBlockedUsers } from '@modorix-commons/gateways/block-user-gateway';
import { XUser } from '@modorix-commons/models/x-user';
import { useEffect, useState } from 'react';
import { BlockUserReasons } from '../components/block-user-reasons';

export default function BlocksPage() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);

  useEffect(() => {
    (async () => {
      setBlockedUsers(await getBlockedUsers());
    })();
  }, []);

  return (
    <section className="w-full mx-auto max-w-screen-md">
      <h1 className="main-title">Your Modorix blocked users</h1>
      <XUsersTable BlockReasonComponent={BlockUserReasons} blockedUsers={blockedUsers} rowGridCols="grid-cols-[1fr_1fr_2fr]" />
    </section>
  );
}
