import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockXUsersService } from '../domain/block-x-user.service';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockXUsersController } from './block-x-user.controller';
import { BlockXUserRequestDto } from './x-user-dto';

describe('BlockUserController', () => {
  function getXUser(blockReasonIds: string[]): BlockXUserRequestDto {
    return {
      xId: 1,
      xUsername: '@1-username',
      blockedAt: '2024-05-27T18:01:45Z',
      blockReasonIds,
      blockingModorixUserId: '1',
    };
  }

  let blockXUserController: BlockXUsersController;
  let blockXUserService: BlockXUsersService;
  let blockXUserSpy: jest.SpyInstance;
  let addXUserToBlockQueueSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockXUsersController],
      providers: [BlockXUsersService, BlockXUsersRepository, GroupsRepository, BlockReasonsRepository],
    }).compile();

    blockXUserController = app.get<BlockXUsersController>(BlockXUsersController);
    blockXUserService = app.get<BlockXUsersService>(BlockXUsersService);
    blockXUserSpy = jest.spyOn(blockXUserService, 'blockXUser');
    addXUserToBlockQueueSpy = jest.spyOn(blockXUserService, 'addToBlockQueue');
  });

  describe('Block X user', () => {
    it('should block a X user', () => {
      blockXUserController.blockXUser(getXUser(['1']));
      expect(blockXUserSpy).toHaveBeenCalledWith({
        xId: 1,
        xUsername: '@1-username',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasonIds: ['1'],
        blockingModorixUserId: '1',
      });
    });

    it('should not block a X user without reason', () => {
      expect(() => {
        blockXUserController.blockXUser(getXUser([]));
      }).toThrow(new BadRequestException('could not block user "@1-username" because no reason was given'));
    });

    it('should not block a X user with non existing reason', () => {
      expect(() => {
        blockXUserController.blockXUser(getXUser(['12']));
      }).toThrow(new BadRequestException('could not block user "@1-username" because at least one reason does not exist'));
    });
  });

  describe('Add a X user to block queue', () => {
    it('should add a X user to Modorix user block queue', () => {
      addXUserToBlockQueueSpy.mockImplementationOnce(() => {});

      blockXUserController.addXUserToBlockQueue({ modorixUserId: 'modorix-user-id' }, { xUserId: 862285194 });

      expect(addXUserToBlockQueueSpy).toHaveBeenCalledWith(862285194, 'modorix-user-id');
    });

    it("should not add X user to block queue if he hasn't been blocked by any Modorix user", () => {
      expect(() => {
        blockXUserController.addXUserToBlockQueue({ modorixUserId: 'modorix-user-id' }, { xUserId: 0 });
      }).toThrow(new NotFoundException('X user with id "0" was not found'));
    });
  });
});
