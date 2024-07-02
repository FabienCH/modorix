import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { getBlockedUsers } from '@modorix-commons/gateways/block-user-gateway';
import { XUser } from '@modorix-commons/models/x-user';
import { Button } from '@modorix-ui/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@modorix-ui/components/tabs';
import { useEffect, useState } from 'react';
import { addToBlockQueue, getBlockQueueCandidates } from '../adapters/gateways/block-user-gateway';
import { AutoResizeBadgesWithTooltip } from '../components/auto-resize-badges-with-tooltip';

export default function BlocksPage() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);
  const [blockQueueCandidates, setBlockQueueCandidates] = useState<XUser[]>([]);

  const blockedInGroupsColConfig = {
    index: 2,
    columnLabel: 'Blocked In',
    getCellElem: (xUser: XUser) => (
      <AutoResizeBadgesWithTooltip
        items={(xUser.blockedInGroups ?? []).map((group) => ({ id: group.id, label: group.name }))}
        badgeVariant="outline"
      ></AutoResizeBadgesWithTooltip>
    ),
  };
  const addToBlockQueueColConfig = {
    index: 4,
    columnLabel: 'Add To Queue',
    getCellElem: (xUser: XUser) => (
      <Button size={'sm'} onClick={() => addXUserToQueue(xUser)}>
        Add to Queue
      </Button>
    ),
  };

  useEffect(() => {
    (async () => {
      setBlockedUsers(await getBlockedUsers('1'));
      setBlockQueueCandidates(await getBlockQueueCandidates('1'));
    })();
  }, []);

  async function addXUserToQueue(xUser: XUser): Promise<void> {
    addToBlockQueue('1', xUser.id);
    setBlockQueueCandidates(await getBlockQueueCandidates('1'));
  }

  return (
    <section className="w-full mx-auto max-w-screen-lg">
      <Tabs defaultValue="add-to-blocks-queue">
        <TabsList className="mx-auto mb-4">
          <TabsTrigger value="add-to-blocks-queue">Add to blocks queue</TabsTrigger>
          <TabsTrigger value="my-blocks-list">My blocks list</TabsTrigger>
        </TabsList>
        <TabsContent value="add-to-blocks-queue">
          <XUsersTable
            BadgesComponent={AutoResizeBadgesWithTooltip}
            blockedUsers={blockQueueCandidates}
            optionalColsConfig={[blockedInGroupsColConfig, addToBlockQueueColConfig]}
            rowGridCols="grid-cols-[1fr_1fr_2fr_2fr_auto]"
          />
        </TabsContent>
        <TabsContent value="my-blocks-list">
          <XUsersTable
            BadgesComponent={AutoResizeBadgesWithTooltip}
            blockedUsers={blockedUsers}
            optionalColsConfig={[blockedInGroupsColConfig]}
            rowGridCols="grid-cols-[1fr_1fr_2fr_2fr]"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
