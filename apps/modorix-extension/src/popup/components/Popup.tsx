import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { getBlockedUsers, getBlockQueue } from '@modorix-commons/gateways/block-user-gateway';
import { XUser } from '@modorix-commons/models/x-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@modorix-ui/components/tabs';
import { useEffect, useState } from 'react';
import { BlockUserReasons } from './block-user-reasons';

export default function Popup() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);
  const [blockQueue, setBlockQueue] = useState<XUser[]>([]);

  useEffect(() => {
    (async () => {
      setBlockedUsers(await getBlockedUsers('1'));
      setBlockQueue(await getBlockQueue('1'));
    })();
  }, []);

  return (
    <Tabs className="p-2" defaultValue="my-blocks-queue">
      <div className="flex">
        <img src="/icon/48.png" className="w-7 h-7 mr-1.5 absolute top-[15px]" />
        <TabsList className="mx-auto mb-4">
          <TabsTrigger value="my-blocks-queue">My blocks queue</TabsTrigger>
          <TabsTrigger value="my-blocks-list">My blocks list</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="my-blocks-queue">
        <XUsersTable BadgesComponent={BlockUserReasons} blockedUsers={blockQueue} rowGridCols="grid-cols-[1fr_107px_122px]" />
      </TabsContent>

      <TabsContent value="my-blocks-list">
        <XUsersTable BadgesComponent={BlockUserReasons} blockedUsers={blockedUsers} rowGridCols="grid-cols-[1fr_107px_122px]" />
      </TabsContent>
    </Tabs>
  );
}
