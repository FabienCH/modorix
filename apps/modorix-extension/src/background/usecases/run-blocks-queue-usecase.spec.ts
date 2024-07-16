import { BlocksQueueUpdateMessageData } from '../../shared/messages/event-message';
import * as BlockXUserGateway from '../infrastructure/gateways/block-user-gateway';
import * as XGateway from '../infrastructure/gateways/x-gateway';
import * as XHeaders from '../wait-for-x-headers';
import { runBlocksQueue } from './run-blocks-queue-usecase';

describe('Running blocks queue', () => {
  let updateBlockedXUserSpy: jest.SpyInstance;
  let blockUserOnXSpy: jest.SpyInstance;
  let setTimeoutSpy: jest.SpyInstance;
  let presenterNotifierState: { [callNth: number]: BlocksQueueUpdateMessageData };
  let presenterNotifierCallNth: number;

  const blockQueueUsers = [
    {
      xId: '1',
      xUsername: '1',
      blockedAt: '2024-06-19T18:41:45Z',
      blockReasons: [],
      blockedInGroups: [{ id: 'UK', name: 'United Kingdom' }],
      blockingModorixUserIds: [],
      blockQueueModorixUserIds: [],
    },
    {
      xId: '2',
      xUsername: '2',
      blockedAt: '2024-06-20T18:41:45Z',
      blockReasons: [],
      blockedInGroups: [{ id: 'FR', name: 'France' }],
      blockingModorixUserIds: [],
      blockQueueModorixUserIds: [],
    },
  ];
  const presenterNotifier = (state: BlocksQueueUpdateMessageData) => {
    presenterNotifierState[presenterNotifierCallNth] = state;
    presenterNotifierCallNth++;
  };

  beforeEach(async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
    setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
      callback();
      return {} as NodeJS.Timeout;
    });
    updateBlockedXUserSpy = jest.spyOn(BlockXUserGateway, 'updateBlockedUser').mockReturnValue(Promise.resolve({} as Response));
    blockUserOnXSpy = jest.spyOn(XGateway, 'blockUserOnX').mockReturnValue(Promise.resolve({} as Response));
    jest.spyOn(XHeaders, 'waitForXHeaders').mockReturnValue(Promise.resolve({}));
    presenterNotifierState = {};
    presenterNotifierCallNth = 0;
  });

  it('should block a user on X and save it on modorix', async () => {
    await runBlocksQueue([blockQueueUsers[0]], presenterNotifier);

    expect(blockUserOnXSpy).toHaveBeenCalledWith('1', {});
    expect(updateBlockedXUserSpy).toHaveBeenCalledWith('1');
  });

  it('should have a delay between each block request to avoid X logout or account suspension', async () => {
    await runBlocksQueue(blockQueueUsers, presenterNotifier);

    expect(updateBlockedXUserSpy).toHaveBeenCalledTimes(2);
    expect(blockUserOnXSpy).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy).toHaveBeenNthCalledWith(1, expect.anything(), 0);
    expect(setTimeoutSpy).toHaveBeenNthCalledWith(2, expect.anything(), 5300);
  });

  it('should update the view after each block request', async () => {
    await runBlocksQueue(blockQueueUsers, presenterNotifier);

    expect(presenterNotifierState[0]).toEqual({
      runQueueStatus: 'waitingHeaders',
      blockQueue: blockQueueUsers,
    });
    expect(presenterNotifierState[1]).toEqual({
      runQueueStatus: 'running',
      blockQueue: [blockQueueUsers[1]],
    });
    expect(presenterNotifierState[2]).toEqual({ runQueueStatus: 'ready', blockQueue: [] });
  });

  it('should stop queue on 403 from X', async () => {
    blockUserOnXSpy.mockImplementationOnce(() => {
      return { status: 403 };
    });

    await runBlocksQueue(blockQueueUsers, presenterNotifier);

    expect(blockUserOnXSpy).toHaveBeenCalledTimes(1);
    expect(updateBlockedXUserSpy).toHaveBeenCalledTimes(0);
  });
});
