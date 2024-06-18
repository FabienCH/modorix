import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { getBlockedUsers } from '@modorix-commons/gateways/block-user-gateway';
import { XUser } from '@modorix-commons/models/x-user';
import { useEffect, useState } from 'react';
import { BlockUserReasons } from '../content/components/block-user-reasons';

export default function Popup() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);

  useEffect(() => {
    (async () => {
      setBlockedUsers(await getBlockedUsers());
    })();
  }, []);

  return (
    <>
      <h1 className="flex items-center text-xl p-2 border-b text-modorix-950 bg-white">
        <img src="/icon/48.png" className="w-7 mr-1.5" />
        Your Modorix blocked users
      </h1>
      <div className="p-4">
        <XUsersTable BlockReasonComponent={BlockUserReasons} blockedUsers={blockedUsers} rowGridCols="grid-cols-[1fr_107px_122px]" />
      </div>
    </>
  );
}
