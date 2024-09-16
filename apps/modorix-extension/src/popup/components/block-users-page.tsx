import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { XUser } from '@modorix-commons/domain/models/x-user';
import { getBlockedUsers, getBlockQueue } from '@modorix-commons/gateways/block-user-gateway';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@modorix-ui/components/tabs';
import { useEffect, useState } from 'react';
import { getAccessTokenFromBrowserStorage } from '../../content/infrastructure/storage/browser-user-session-storage';
import { BlocksQueueUpdateMessageData } from '../../shared/messages/event-message';
import { onRunBlocksQueueUpdate, requestRunBlocksQueue } from '../popup-handler';
import { BlockUserReasons } from './block-user-reasons';
import { BlocksQueue } from './blocks-queue';

enum TabsEnum {
  BLOCKS_QUEUE = 'my-blocks-queue',
  BLOCKS_LIST = 'my-blocks-list',
}

export default function BlockUsers() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);
  const [blockQueueState, setBlockQueueState] = useState<BlocksQueueUpdateMessageData>({ blockQueue: [], runQueueStatus: 'ready' });

  useEffect(() => {
    (async () => {
      onRunBlocksQueueUpdate(setBlockQueueState);
      const blockedXUsers = await getBlockedUsers(getAccessTokenFromBrowserStorage);
      if (blockedXUsers?.length) {
        setBlockedUsers(blockedXUsers);
      }
      const blockQueue = await getBlockQueue(getAccessTokenFromBrowserStorage);
      if (blockQueue?.length) {
        setBlockQueueState({ blockQueue, runQueueStatus: 'ready' });
      }
    })();
  }, []);

  useEffect(() => {
    if (blockQueueState.runQueueStatus === 'error') {
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: 'red' });
    } else {
      chrome.action.setBadgeText({ text: '' });
      chrome.action.setBadgeBackgroundColor({ color: 'transparent' });
    }
  }, [blockQueueState]);

  async function runQueue(): Promise<void> {
    requestRunBlocksQueue(blockQueueState.blockQueue);
  }

  return (
    <Tabs className="p-2" defaultValue={TabsEnum.BLOCKS_QUEUE}>
      <TabsList className="mx-auto mb-4">
        <TabsTrigger value={TabsEnum.BLOCKS_QUEUE}>My blocks queue</TabsTrigger>
        <TabsTrigger value={TabsEnum.BLOCKS_LIST}>My blocks list</TabsTrigger>
      </TabsList>
      <TabsContent className="flex flex-col mt-0" value={TabsEnum.BLOCKS_QUEUE}>
        <BlocksQueue {...blockQueueState} onRunQueueClick={runQueue}></BlocksQueue>
      </TabsContent>
      <TabsContent value={TabsEnum.BLOCKS_LIST}>
        <XUsersTable BadgesComponent={BlockUserReasons} blockedUsers={blockedUsers} rowGridCols="grid-cols-[1fr_107px_140px]" />
      </TabsContent>
    </Tabs>
  );
}
