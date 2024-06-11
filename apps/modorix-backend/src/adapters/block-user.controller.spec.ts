import { Test, TestingModule } from '@nestjs/testing';
import { BlockUsersService } from '../domain/block-user.service';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockUsersRepository } from '../infrastructure/block-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockUsersController } from './block-user.controller';

describe('BlockUserController', () => {
  let blockUserController: BlockUsersController;
  let blockUserRepository: BlockUsersRepository;
  let blockUserSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockUsersController],
      providers: [BlockUsersService, BlockUsersRepository, GroupsRepository, BlockReasonsRepository],
    }).compile();

    blockUserController = app.get<BlockUsersController>(BlockUsersController);
    blockUserRepository = app.get<BlockUsersRepository>(BlockUsersRepository);
    blockUserSpy = jest.spyOn(blockUserRepository, 'blockUser');
  });

  describe('Block X user', () => {
    it('should block a X user"', () => {
      blockUserController.blockUser({ id: '1', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'] });
      expect(blockUserSpy).toHaveBeenCalledWith({ id: '1', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'] });
    });
  });
});
