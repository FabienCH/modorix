import { Test, TestingModule } from '@nestjs/testing';
import { BlockXUsersInMemoryRepository } from '../../infrastructure/repositories/in-memory/block-x-user-in-memory.repository';
import { GroupsInMemoryRepository } from '../../infrastructure/repositories/in-memory/groups-in-memory.repository';
import { GroupNotFoundError } from '../errors/group-not-found-error';
import { BlockXUsersRepositoryToken } from '../repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../repositories/groups.repository';
import { GroupsService } from './group.service';

describe('GroupsService', () => {
  let groupsService: GroupsService;
  let groupsRepository: GroupsInMemoryRepository;
  let blockUsersRepository: BlockXUsersInMemoryRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: GroupsRepositoryToken, useClass: GroupsInMemoryRepository },
        { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersInMemoryRepository },
      ],
    }).compile();

    groupsService = app.get<GroupsService>(GroupsService);
    groupsRepository = app.get<GroupsInMemoryRepository>(GroupsRepositoryToken);
    blockUsersRepository = app.get<BlockXUsersInMemoryRepository>(BlockXUsersRepositoryToken);
  });

  describe('Get all groups', () => {
    it('should give the list of groups', async () => {
      const groups = await groupsService.groupsList();
      expect(groups).toEqual([
        { id: 'US', name: 'United States', description: 'For people living in US', isJoined: false, blockedXUserIds: [] },
        { id: 'UK', name: 'United Kingdom', description: 'For people living in Uk', isJoined: false, blockedXUserIds: [] },
        { id: 'GE', name: 'Germany', description: 'For people living in Germany', isJoined: false, blockedXUserIds: [] },
        { id: 'FR', name: 'France', description: 'For people living in France', isJoined: false, blockedXUserIds: [] },
        { id: 'ES', name: 'Spain', description: 'For people living in Spain', isJoined: false, blockedXUserIds: [] },
        {
          id: 'scientists',
          name: 'Scientists',
          description: 'For scientists or people working around science',
          isJoined: false,
          blockedXUserIds: [],
        },
        {
          id: 'streamers',
          name: 'Streamers',
          description: 'For streamers or people working around streaming',
          isJoined: false,
          blockedXUserIds: [],
        },
        {
          id: 'influencers',
          name: 'Influencers',
          description: 'For influencers or people working around influencers',
          isJoined: false,
          blockedXUserIds: [],
        },
        {
          id: 'journalists',
          name: 'Journalists',
          description: 'For journalists or people working around journalism',
          isJoined: false,
          blockedXUserIds: [],
        },
        { id: 'artists', name: 'Artists', description: 'For artists or people working around arts', isJoined: false, blockedXUserIds: [] },
        {
          id: 'sports(wo)men',
          name: 'Sports(wo)men',
          description: 'For sports(wo)men or people working around sports',
          isJoined: false,
          blockedXUserIds: [],
        },
      ]);
    });
  });

  describe('Finding a group by id', () => {
    beforeEach(async () => {
      await blockUsersRepository.blockXUser({
        xId: '1',
        xUsername: '@username',
        blockedAt: '2024-06-14T19:01:45Z',
        blockReasons: [{ id: '2', label: 'Spreading fake news' }],
        blockingModorixUserIds: ['1'],
        blockedInGroups: [{ id: 'UK', name: 'United Kingdom' }],
        blockQueueModorixUserIds: [],
      });

      groupsRepository.addBlockedUser('UK', '1');
    });

    it('give the expected group', async () => {
      const ukGroup = await groupsService.findGroupById('UK');

      expect(ukGroup).toEqual({
        id: 'UK',
        name: 'United Kingdom',
        description: 'For people living in Uk',
        isJoined: false,
        blockedXUsers: [
          {
            xId: '1',
            xUsername: '@username',
            blockedAt: '2024-06-14T19:01:45Z',
            blockReasons: [{ id: '2', label: 'Spreading fake news' }],
            blockingModorixUserIds: ['1'],
            blockedInGroups: [{ id: 'UK', name: 'United Kingdom' }],
            blockQueueModorixUserIds: [],
          },
        ],
      });
    });

    it('should not give a non existing group', async () => {
      await expect(async () => {
        await groupsService.findGroupById('non existing id');
      }).rejects.toThrow(new GroupNotFoundError('non existing id'));
    });
  });

  describe('Join a group', () => {
    it('should change joined group status to joined', async () => {
      await groupsService.joinGroup('UK');

      const ukGroup = (await groupsRepository.groupsList()).find((group) => group.id === 'UK');
      expect(ukGroup?.isJoined).toBe(true);
    });

    it('should not change joined group status of a non existing group', async () => {
      await expect(async () => {
        await groupsService.joinGroup('non existing id');
      }).rejects.toThrow(new GroupNotFoundError('non existing id'));
    });
  });

  describe('Leave a group', () => {
    it('should change joined group status to left', async () => {
      await groupsRepository.updateIsJoined('ES', true);

      await groupsService.leaveGroup('ES');

      const esGroup = (await groupsRepository.groupsList()).find((group) => group.id === 'ES');
      expect(esGroup?.isJoined).toBe(false);
    });

    it('should not change joined group status of a non existing group', async () => {
      await expect(async () => {
        await groupsService.joinGroup('non existing id');
      }).rejects.toThrow(new GroupNotFoundError('non existing id'));
    });
  });
});
