import { BlockEvent } from '../domain/models/block-event';
import { XUser } from '../domain/models/x-user';
import { mapToXUserData } from './to-x-user-data';

describe('Map a X user to a displayable user in table', () => {
  let xUser: XUser;
  let blockEvents: BlockEvent[];

  beforeEach(() => {
    blockEvents = [
      {
        modorixUserId: '1',
        blockedAt: new Date('2024-05-27T18:01:45Z'),
        blockedInGroups: [
          {
            id: 'GE',
            name: 'Germany',
          },
        ],
        blockReasons: [{ id: '1', label: 'Racism / Xenophobia' }],
      },
      {
        modorixUserId: '2',
        blockedAt: new Date('2024-05-22T18:01:45Z'),
        blockedInGroups: [
          {
            id: 'FR',
            name: 'France',
          },
        ],
        blockReasons: [{ id: '2', label: 'Spreading fake news' }],
      },
    ];

    xUser = {
      xId: '1',
      xUsername: '@username',
      blockEvents,
      blockQueueModorixUserIds: [],
    };
  });

  it('should map X user to data to be displayed in a table', () => {
    const xUserToDisplay = mapToXUserData(xUser);
    expect(xUserToDisplay).toEqual({
      xUsername: '@username',
      firstBlockedAt: '5/22/2024',
      blockReasons: [
        {
          id: '1',
          label: 'Racism / Xenophobia',
        },
        {
          id: '2',
          label: 'Spreading fake news',
        },
      ],
    });
  });

  it('should map X user to data to be displayed in a table with multiple same block reasons', () => {
    xUser.blockEvents[1].blockReasons.push({ id: '1', label: 'Racism / Xenophobia' });
    const xUserToDisplay = mapToXUserData(xUser);
    expect(xUserToDisplay).toEqual({
      xUsername: '@username',
      firstBlockedAt: '5/22/2024',
      blockReasons: [
        {
          id: '1',
          label: 'Racism / Xenophobia (2)',
        },
        {
          id: '2',
          label: 'Spreading fake news',
        },
      ],
    });
  });
});
