import { Test, TestingModule } from '@nestjs/testing';
import { BlockUserController } from './block-user.controller';
import { BlockUserService } from '../domain/block-user.service';

describe('BlockUserController', () => {
  let blockUserController: BlockUserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockUserController],
      providers: [BlockUserService],
    }).compile();

    blockUserController = app.get<BlockUserController>(BlockUserController);
  });

  describe('Block X user', () => {
    it('should block a X user"', () => {
      expect(blockUserController.blockUser({ id: '1', blockedAt: '2024-05-27T18:01:45Z' })).toHaveBeenCalled()
    });
  });
});
