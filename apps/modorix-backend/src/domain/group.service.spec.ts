import { Test, TestingModule } from '@nestjs/testing';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { GroupNotFoundError } from './errors/group-not-found-error';
import { GroupsService } from './group.service';

describe('GroupsService', () => {
  let groupsService: GroupsService;
  let groupsRepository: GroupsRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, GroupsRepository],
    }).compile();

    groupsService = app.get<GroupsService>(GroupsService);
    groupsRepository = app.get<GroupsRepository>(GroupsRepository);
  });

  describe('Get all groups', () => {
    it('should give the list of groups', () => {
      const groups = groupsService.groupsList();
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

  describe('Join a group', () => {
    it('should change joined group status to joined', () => {
      groupsService.joinGroup('UK');

      const ukGroup = groupsService.groupsList().find((group) => group.id === 'UK');
      expect(ukGroup?.isJoined).toBe(true);
    });

    it('should not change joined group status of a non existing group', () => {
      expect(() => {
        groupsService.joinGroup('non existing id');
      }).toThrow(new GroupNotFoundError('non existing id'));
    });
  });

  describe('Leave a group', () => {
    it('should change joined group status to left', () => {
      groupsRepository.updateIsJoined('ES', true);

      groupsService.leaveGroup('ES');

      const esGroup = groupsService.groupsList().find((group) => group.id === 'ES');
      expect(esGroup?.isJoined).toBe(false);
    });

    it('should not change joined group status of a non existing group', () => {
      expect(() => {
        groupsService.joinGroup('non existing id');
      }).toThrow(new GroupNotFoundError('non existing id'));
    });
  });
});
