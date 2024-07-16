import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { getBlockedUsers, getBlockQueue } from '@modorix-commons/gateways/block-user-gateway';
import { XUser } from '@modorix-commons/models/x-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@modorix-ui/components/tabs';
import { useEffect, useState } from 'react';
import { BlocksQueueUpdateMessageData } from '../../shared/messages/event-message';
import { onRunBlocksQueueUpdate, requestRunBlocksQueue } from '../popup-handler';
import { BlockUserReasons } from './block-user-reasons';
import { BlocksQueue } from './blocks-queue';

enum TabsEnum {
  BLOCKS_QUEUE = 'my-blocks-queue',
  BLOCKS_LIST = 'my-blocks-list',
}

export default function Popup() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);
  const [blockQueueState, setBlockQueueState] = useState<BlocksQueueUpdateMessageData>({ blockQueue: [], runQueueStatus: 'ready' });

  useEffect(() => {
    (async () => {
      onRunBlocksQueueUpdate(setBlockQueueState);
      setBlockedUsers(await getBlockedUsers('1'));
      setBlockQueueState({ blockQueue: await getBlockQueue('1'), runQueueStatus: 'ready' });
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
      <div className="flex">
        <img src="/icon/48.png" className="w-7 h-7 mr-1.5 absolute top-[15px]" />
        <TabsList className="mx-auto mb-4">
          <TabsTrigger value={TabsEnum.BLOCKS_QUEUE}>My blocks queue</TabsTrigger>
          <TabsTrigger value={TabsEnum.BLOCKS_LIST}>My blocks list</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent className="flex flex-col mt-0" value={TabsEnum.BLOCKS_QUEUE}>
        <BlocksQueue {...blockQueueState} onRunQueueClick={runQueue}></BlocksQueue>
      </TabsContent>
      <TabsContent value={TabsEnum.BLOCKS_LIST}>
        <XUsersTable BadgesComponent={BlockUserReasons} blockedUsers={blockedUsers} rowGridCols="grid-cols-[1fr_107px_140px]" />
      </TabsContent>
    </Tabs>
  );
}
