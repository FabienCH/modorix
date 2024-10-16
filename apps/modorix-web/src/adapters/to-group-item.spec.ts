import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { mapToGroupItem } from './to-group-item';

describe('Map block events groups to displayable items', () => {
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
  });

  it('should map block events to items displayed in a table', () => {
    const xUserToDisplay = mapToGroupItem(blockEvents);
    expect(xUserToDisplay).toEqual([
      {
        id: 'GE',
        label: 'Germany',
      },
      {
        id: 'FR',
        label: 'France',
      },
    ]);
  });

  it('should map  block events to items displayed in a table with no duplicate', () => {
    blockEvents[1].blockedInGroups.push({
      id: 'GE',
      name: 'Germany',
    });
    const xUserToDisplay = mapToGroupItem(blockEvents);
    expect(xUserToDisplay).toEqual([
      {
        id: 'GE',
        label: 'Germany',
      },
      {
        id: 'FR',
        label: 'France',
      },
    ]);
  });
});
