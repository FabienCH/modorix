import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockXUsersService } from '../domain/block-x-user.service';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockXUsersController } from './block-x-user.controller';

describe('BlockUserController', () => {
  let blockXUserController: BlockXUsersController;
  let blockXUserRepository: BlockXUsersRepository;
  let blockXUserSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockXUsersController],
      providers: [BlockXUsersService, BlockXUsersRepository, GroupsRepository, BlockReasonsRepository],
    }).compile();

    blockXUserController = app.get<BlockXUsersController>(BlockXUsersController);
    blockXUserRepository = app.get<BlockXUsersRepository>(BlockXUsersRepository);
    blockXUserSpy = jest.spyOn(blockXUserRepository, 'blockXUser');
  });

  describe('Block X user', () => {
    it('should block a X user', () => {
      blockXUserController.blockXUser({ id: '1', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'], blockingUserId: '1' });
      expect(blockXUserSpy).toHaveBeenCalledWith({
        id: '1',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [{ id: '1', label: 'Racism / Xenophobia' }],
        blockingUserIds: ['1'],
        blockedInGroups: [],
      });
    });

    it('should not block a X user without reason', () => {
      expect(() => {
        blockXUserController.blockXUser({ id: '1', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: [], blockingUserId: '1' });
      }).toThrow(new BadRequestException('could not block user "1" because no reason was given'));
    });

    it('should not block a X user with non existing reason', () => {
      expect(() => {
        blockXUserController.blockXUser({ id: '1', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['12'], blockingUserId: '1' });
      }).toThrow(new BadRequestException('could not block user "1" because at least one reason does not exist'));
    });
  });
});
