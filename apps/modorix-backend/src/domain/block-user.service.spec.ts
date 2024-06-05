import { Test, TestingModule } from '@nestjs/testing';
import { BlockUsersRepository } from '../infrastructure/block-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockUsersService } from './block-user.service';

describe('BlockUsersService', () => {
  let blockUsersService: BlockUsersService;
  let groupsRepository: GroupsRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [BlockUsersService, BlockUsersRepository, GroupsRepository],
    }).compile();

    blockUsersService = app.get<BlockUsersService>(BlockUsersService);
    groupsRepository = app.get<GroupsRepository>(GroupsRepository);
  });

  describe('block a user', () => {
    it('should add user to the block list', () => {
      blockUsersService.blockUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z' });

      const blockedUser = blockUsersService.blockedUsersList().find((user) => user.id === '@userId');

      expect(blockedUser).toEqual({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z' });
    });

    it('should add the blocked user too all groups', () => {
      blockUsersService.blockUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z' });

      const groupsBlockedXUserIds = groupsRepository.groupsList().flatMap((group) => group.blockedXUserIds);
      const expectedIds = groupsBlockedXUserIds.map(() => '@userId');

      expect(groupsBlockedXUserIds).toEqual(expectedIds);
    });
  });
});
