import { showErrorToast } from '@modorix-commons/components/show-error-toast';
import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { XUser } from '@modorix-commons/domain/models/x-user';
import { getBlockedUsers, getBlockQueue } from '@modorix-commons/gateways/block-user-gateway';
import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@modorix-ui/components/tabs';
import { useCallback, useEffect, useState } from 'react';
import { addToBlockQueue, getBlockQueueCandidates } from '../adapters/gateways/block-x-user-gateway';
import { mapToGroupItem } from '../adapters/to-group-item';
import { AddToQueueButton } from '../components/shared/add-to-queue-button';
import { AutoResizeBadgesWithTooltip } from '../components/shared/auto-resize-badges-with-tooltip';
import { addXUserToQueue } from '../domain/block-x-user/add-user-to-queue-usecase';
import { retrieveBlockQueueCandidates } from '../domain/block-x-user/retrieve-block-queue-candidates-usecase';
import { retrieveBlockQueue } from '../domain/block-x-user/retrieve-block-queue-usecase';
import { retrieveBlockedUsers } from '../domain/block-x-user/retrieve-blocked-users-usecase';

export default function BlocksPage() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);
  const [blockQueue, setBlockQueue] = useState<XUser[]>([]);
  const [blockQueueCandidates, setBlockQueueCandidates] = useState<XUser[]>([]);
  const { dependencies } = useDependenciesContext();
  const { setUserSessionInfos } = useUserSessionInfos();

  const blockedInGroupsColConfig = {
    index: 2,
    column: { cellElem: 'Blocked In' },
    getCellElem: (xUser: XUser) => (
      <AutoResizeBadgesWithTooltip items={mapToGroupItem(xUser.blockEvents)} badgeVariant="outline"></AutoResizeBadgesWithTooltip>
    ),
  };
  const addToBlockQueueColConfig = {
    index: 4,
    column: { cellElem: 'Add To Queue' },
    getCellElem: (xUser: XUser) => <AddToQueueButton onClick={() => runAddXUserToQueue(xUser)}></AddToQueueButton>,
  };

  const runRetrieveBlockQueue = useCallback(async () => {
    await retrieveBlockQueue(getBlockQueue, setBlockQueue, showErrorToast, { ...dependencies.userSessionStorage, setUserSessionInfos });
  }, [dependencies, setUserSessionInfos]);

  useEffect(() => {
    runRetrieveBlockQueue();
  }, [runRetrieveBlockQueue]);

  async function runAddXUserToQueue(xUser: XUser): Promise<void> {
    const { userSessionStorage } = dependencies;
    await addXUserToQueue(xUser, addToBlockQueue, runRetrieveBlockQueueCandidates, showErrorToast, {
      userSessionStorage,
      setUserSessionInfos,
    });
  }

  async function runRetrieveBlockQueueCandidates() {
    await retrieveBlockQueueCandidates(getBlockQueueCandidates, setBlockQueueCandidates, showErrorToast, {
      ...dependencies.userSessionStorage,
      setUserSessionInfos,
    });
  }

  async function loadBlockList(value: string): Promise<void> {
    if (value === 'add-to-blocks-queue' && blockQueueCandidates.length === 0) {
      await runRetrieveBlockQueueCandidates();
    }
    if (value === 'my-blocks-list' && blockedUsers.length === 0) {
      await retrieveBlockedUsers(getBlockedUsers, setBlockedUsers, showErrorToast, {
        ...dependencies.userSessionStorage,
        setUserSessionInfos,
      });
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
            rowGridCols="grid-cols-[1fr_7.5rem_2fr_2fr]"
          />
        </TabsContent>
        <TabsContent value="add-to-blocks-queue">
          <XUsersTable
            BadgesComponent={AutoResizeBadgesWithTooltip}
            blockedUsers={blockQueueCandidates}
            optionalColsConfig={[blockedInGroupsColConfig, addToBlockQueueColConfig]}
            rowGridCols="grid-cols-[1fr_7.5rem_2fr_2fr_auto]"
          />
        </TabsContent>
        <TabsContent value="my-blocks-list">
          <XUsersTable
            BadgesComponent={AutoResizeBadgesWithTooltip}
            blockedUsers={blockedUsers}
            optionalColsConfig={[blockedInGroupsColConfig]}
            rowGridCols="grid-cols-[1fr_7.5rem_2fr_2fr]"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
