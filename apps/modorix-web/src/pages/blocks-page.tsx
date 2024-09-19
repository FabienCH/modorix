import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { getBlockedUsers, getBlockQueue } from '@modorix-commons/gateways/block-user-gateway';
import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@modorix-ui/components/tabs';
import { useCallback, useEffect, useState } from 'react';
import { XUser } from '../../../../packages/modorix-commons/src/domain/models/x-user';
import { addToBlockQueue, getBlockQueueCandidates } from '../adapters/gateways/block-x-user-gateway';
import { AddToQueueButton } from '../components/shared/add-to-queue-button';
import { AutoResizeBadgesWithTooltip } from '../components/shared/auto-resize-badges-with-tooltip';
import { retrieveBlockQueueCandidates } from '../domain/block-x-user/retrieve-block-queue-candidates-usecase';
import { retrieveBlockQueue } from '../domain/block-x-user/retrieve-block-queue-usecase';
import { retrieveBlockedUsers } from '../domain/block-x-user/retrieve-blocked-users-usecase';

export default function BlocksPage() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);
  const [blockQueue, setBlockQueue] = useState<XUser[]>([]);
  const [blockQueueCandidates, setBlockQueueCandidates] = useState<XUser[]>([]);
  const { dependencies } = useDependenciesContext();

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
    getCellElem: (xUser: XUser) => <AddToQueueButton onClick={() => addXUserToQueue(xUser)}></AddToQueueButton>,
  };

  const runRetrieveBlockQueue = useCallback(async () => {
    await retrieveBlockQueue(getBlockQueue, setBlockQueue, dependencies.userSessionStorage);
  }, [dependencies]);

  useEffect(() => {
    runRetrieveBlockQueue();
  }, [runRetrieveBlockQueue]);

  async function addXUserToQueue(xUser: XUser): Promise<void> {
    const addToBlockQueueRes = await addToBlockQueue(xUser.xId, dependencies.userSessionStorage);
    if (addToBlockQueueRes && 'error' in addToBlockQueueRes) {
      console.log('addToBlockQueue auth error');
    }
    const blockQueueCandidatesRes = await getBlockQueueCandidates(dependencies.userSessionStorage);
    if ('error' in blockQueueCandidatesRes === false) {
      setBlockQueueCandidates(blockQueueCandidatesRes);
    }
  }

  async function loadBlockList(value: string): Promise<void> {
    if (value === 'add-to-blocks-queue' && blockQueueCandidates.length === 0) {
      await retrieveBlockQueueCandidates(getBlockQueueCandidates, setBlockQueueCandidates, dependencies.userSessionStorage);
    }
    if (value === 'my-blocks-list' && blockedUsers.length === 0) {
      await retrieveBlockedUsers(getBlockedUsers, setBlockedUsers, dependencies.userSessionStorage);
    }
  }

  return (
    <section className="w-full mx-auto max-w-screen-lg">
      <Tabs defaultValue="my-blocks-queue" onValueChange={loadBlockList}>
        <TabsList className="mx-auto mb-4">
          <TabsTrigger value="my-blocks-queue">My blocks queue</TabsTrigger>
          <TabsTrigger value="add-to-blocks-queue">Add to blocks queue</TabsTrigger>
          <TabsTrigger value="my-blocks-list">My blocks list</TabsTrigger>
        </TabsList>
        <TabsContent value="my-blocks-queue">
          <XUsersTable
            BadgesComponent={AutoResizeBadgesWithTooltip}
            blockedUsers={blockQueue}
            optionalColsConfig={[blockedInGroupsColConfig]}
            rowGridCols="grid-cols-[1fr_1fr_2fr_2fr]"
          />
        </TabsContent>
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
