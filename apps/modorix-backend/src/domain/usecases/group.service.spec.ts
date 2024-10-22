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
      const groups = await groupsService.groupsList('1');
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
        blockEvents: [
          {
            modorixUserId: '1',
            blockedAt: new Date('2024-06-14T19:01:45Z'),
            blockReasons: [{ id: '2', label: 'Spreading fake news' }],
            blockedInGroups: [{ id: 'UK', name: 'United Kingdom' }],
          },
        ],
        blockQueueModorixUserIds: [],
      });

      groupsRepository.addBlockedUser('UK', '1');
    });

    it('give the expected group', async () => {
      const ukGroup = await groupsService.findGroupById('UK', '1');

      expect(ukGroup).toEqual({
        id: 'UK',
        name: 'United Kingdom',
        description: 'For people living in Uk',
        isJoined: false,
        membersCount: 0,
        blockedXUsers: [
          {
            xId: '1',
            xUsername: '@username',
            blockEvents: [
              {
                modorixUserId: '1',
                blockedAt: new Date('2024-06-14T19:01:45Z'),
                blockReasons: [{ id: '2', label: 'Spreading fake news' }],
                blockedInGroups: [{ id: 'UK', name: 'United Kingdom' }],
              },
            ],
            blockQueueModorixUserIds: [],
          },
        ],
      });
    });

    it('give the expected group with multiple members', async () => {
      await groupsRepository.joinGroup('FR', '1');
      await groupsRepository.joinGroup('FR', '2');
      await groupsRepository.joinGroup('FR', '3');
      const ukGroup = await groupsService.findGroupById('FR');

      expect(ukGroup).toEqual({
        id: 'FR',
        name: 'France',
        description: 'For people living in France',
        isJoined: false,
        membersCount: 3,
        blockedXUsers: [],
      });
    });

    it('should not give a non existing group', async () => {
      await expect(async () => {
        await groupsService.findGroupById('non existing id', '1');
      }).rejects.toThrow(new GroupNotFoundError('non existing id'));
    });
  });

  describe('Join a group', () => {
    it('should change joined group status to joined for the current user', async () => {
      await groupsService.joinGroup('UK', '1');

      const ukGroup = await groupsRepository.findGroupWithMembersById('UK', '1');
      expect(ukGroup?.isJoined).toBe(true);
    });

    it('should not change joined group status for an other user', async () => {
      await groupsService.joinGroup('UK', '1');

      const ukGroup = await groupsRepository.findGroupWithMembersById('UK', '2');
      expect(ukGroup?.isJoined).toBe(false);
    });

    it('should not change joined group status of a non existing group', async () => {
      await expect(async () => {
        await groupsService.joinGroup('non existing id', '1');
      }).rejects.toThrow(new GroupNotFoundError('non existing id'));
    });
  });

  describe('Leave a group', () => {
    it('should change joined group status to left for the current user', async () => {
      await groupsRepository.joinGroup('ES', '1');

      await groupsService.leaveGroup('ES', '1');

      const esGroup = await groupsRepository.findGroupWithMembersById('ES', '1');
      expect(esGroup?.isJoined).toBe(false);
    });

    it('should not change joined group status for an other user', async () => {
      await groupsRepository.joinGroup('FR', '1');
      await groupsRepository.joinGroup('FR', '2');

      await groupsService.leaveGroup('FR', '1');

      const frGroup = await groupsRepository.findGroupWithMembersById('FR', '2');
      expect(frGroup?.isJoined).toBe(true);
    });

    it('should not change joined group status of a non existing group', async () => {
      await expect(async () => {
        await groupsService.joinGroup('non existing id', '1');
      }).rejects.toThrow(new GroupNotFoundError('non existing id'));
    });
  });
});
