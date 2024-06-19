import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { getBlockedUsers, getBlockQueueCandidates } from '@modorix-commons/gateways/block-user-gateway';
import { XUser } from '@modorix-commons/models/x-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@modorix-ui/components/tabs';
import { useEffect, useState } from 'react';
import { BlockUserReasons } from '../components/block-user-reasons';

export default function BlocksPage() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);
  const [blockQueueCandidates, setBlockQueueCandidates] = useState<XUser[]>([]);

  useEffect(() => {
    (async () => {
      setBlockedUsers(await getBlockedUsers('1'));
      setBlockQueueCandidates(await getBlockQueueCandidates('1'));
    })();
  }, []);

  return (
    <section className="w-full mx-auto max-w-screen-md">
      <Tabs defaultValue="add-to-blocks-queue">
        <TabsList className="mx-auto mb-4">
          <TabsTrigger value="add-to-blocks-queue">Add to blocks queue</TabsTrigger>
          <TabsTrigger value="my-blocks-list">My blocks list</TabsTrigger>
        </TabsList>
        <TabsContent value="add-to-blocks-queue">
          <XUsersTable BlockReasonComponent={BlockUserReasons} blockedUsers={blockQueueCandidates} rowGridCols="grid-cols-[1fr_1fr_2fr]" />
        </TabsContent>
        <TabsContent value="my-blocks-list">
          <XUsersTable BlockReasonComponent={BlockUserReasons} blockedUsers={blockedUsers} rowGridCols="grid-cols-[1fr_1fr_2fr]" />
        </TabsContent>
      </Tabs>
    </section>
  );
}
