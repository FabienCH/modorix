import { Test, TestingModule } from '@nestjs/testing';
import { BlockUserService } from '../domain/block-user.service';
import { BlockUserRepository } from '../infrastructure/block-user.repository';
import { BlockUserController } from './block-user.controller';

describe('BlockUserController', () => {
  let blockUserController: BlockUserController;
  let blockUserRepository: BlockUserRepository;
  let blockUserSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockUserController],
      providers: [BlockUserService, BlockUserRepository],
    }).compile();

    blockUserController = app.get<BlockUserController>(BlockUserController);
    blockUserRepository = app.get<BlockUserRepository>(BlockUserRepository);
    blockUserSpy = jest.spyOn(blockUserRepository, 'blockUser');
  });

  describe('Block X user', () => {
    it('should block a X user"', () => {
      blockUserController.blockUser({ id: '1', blockedAt: '2024-05-27T18:01:45Z' });
      expect(blockUserSpy).toHaveBeenCalledWith({ id: '1', blockedAt: '2024-05-27T18:01:45Z' });
    });
  });
});
