import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockXUsersService } from '../domain/block-x-user.service';
import { XUserNotFoundError } from '../domain/errors/x-user-not-found-error';
import { XUserNotInQueueError } from '../domain/errors/x-user-not-in-queue';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockXUsersController } from './block-x-user.controller';
import { BlockXUserRequestDto } from './x-user-dto';

describe('BlockUserController', () => {
  function getXUser(blockReasonIds: string[]): BlockXUserRequestDto {
    return {
      xId: '1',
      xUsername: '@1-username',
      blockedAt: '2024-05-27T18:01:45Z',
      blockReasonIds,
      blockingModorixUserId: '1',
    };
  }

  let blockXUserController: BlockXUsersController;
  let blockXUsersService: BlockXUsersService;
  let blockXUserSpy: jest.SpyInstance;
  let blockXUserFromQueueSpy: jest.SpyInstance;
  let addXUserToBlockQueueSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockXUsersController],
      providers: [BlockXUsersService, BlockXUsersRepository, GroupsRepository, BlockReasonsRepository],
    }).compile();

    blockXUserController = app.get<BlockXUsersController>(BlockXUsersController);
    blockXUsersService = app.get<BlockXUsersService>(BlockXUsersService);
    blockXUserSpy = jest.spyOn(blockXUsersService, 'blockXUser');
    blockXUserFromQueueSpy = jest.spyOn(blockXUsersService, 'blockXUserFromQueue');
    addXUserToBlockQueueSpy = jest.spyOn(blockXUsersService, 'addToBlockQueue');
  });

  describe('Block X user', () => {
    it('should block a X user', () => {
      blockXUserController.blockXUser(getXUser(['1']));
      expect(blockXUserSpy).toHaveBeenCalledWith({
        xId: '1',
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

  describe('Block X user from queue', () => {
    it('should block a X user', () => {
      blockXUserFromQueueSpy.mockImplementationOnce(() => {});

      blockXUserController.blockXUserFromQueue({ modorixUserId: '1' }, { xUserId: '862285194' });

      expect(blockXUserFromQueueSpy).toHaveBeenCalledWith('862285194', '1');
    });

    it('should not block a X user if he does not exist', () => {
      blockXUserFromQueueSpy.mockImplementationOnce(() => {
        throw new XUserNotFoundError('2');
      });

      expect(() => {
        blockXUserController.blockXUserFromQueue({ modorixUserId: '1' }, { xUserId: '2' });
      }).toThrow(new NotFoundException('X user with id "2" was not found'));
    });

    it("should not block a X user if he is not in Modorix user's block queue", () => {
      blockXUserFromQueueSpy.mockImplementationOnce(() => {
        throw new XUserNotInQueueError('862285194');
      });

      expect(() => {
        blockXUserController.blockXUserFromQueue({ modorixUserId: '1' }, { xUserId: '862285194' });
      }).toThrow(new BadRequestException('X user with id "862285194" is not in Modorix\'s user queue'));
    });
  });

  describe('Add a X user to block queue', () => {
    it('should add a X user to Modorix user block queue', () => {
      addXUserToBlockQueueSpy.mockImplementationOnce(() => {});

      blockXUserController.addXUserToBlockQueue({ modorixUserId: 'modorix-user-id' }, { xUserId: '862285194' });

      expect(addXUserToBlockQueueSpy).toHaveBeenCalledWith('862285194', 'modorix-user-id');
    });

    it("should not add X user to block queue if he hasn't been blocked by any Modorix user", () => {
      expect(() => {
        blockXUserController.addXUserToBlockQueue({ modorixUserId: 'modorix-user-id' }, { xUserId: '0' });
      }).toThrow(new NotFoundException('X user with id "0" was not found'));
    });
  });
});
