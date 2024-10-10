import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockInstance } from 'vitest';
import { XUserNotFoundError } from '../domain/errors/x-user-not-found-error';
import { XUserNotInQueueError } from '../domain/errors/x-user-not-in-queue';
import { BlockReasonsRepositoryToken } from '../domain/repositories/block-reason.repository';
import { BlockXUsersRepositoryToken } from '../domain/repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../domain/repositories/groups.repository';
import { BlockXUsersService } from '../domain/usecases/block-x-user.service';
import { BlockReasonsInMemoryRepository } from '../infrastructure/repositories/in-memory/block-reason-in-memory.repository';
import { BlockXUsersInMemoryRepository } from '../infrastructure/repositories/in-memory/block-x-user-in-memory.repository';
import { GroupsInMemoryRepository } from '../infrastructure/repositories/in-memory/groups-in-memory.repository';
import { BlockXUsersController } from './block-x-user.controller';
import { BlockXUserRequestDto } from './x-user-dto';

describe('BlockUserController', () => {
  function getXUser(blockReasonIds: string[]): BlockXUserRequestDto {
    return {
      xId: '1',
      xUsername: '@1-username',
      blockedAt: '2024-05-27T18:01:45Z',
      blockReasonIds,
    };
  }

  let blockXUserController: BlockXUsersController;
  let blockXUsersService: BlockXUsersService;
  let blockXUserSpy: MockInstance;
  let blockXUserFromQueueSpy: MockInstance;
  let addXUserToBlockQueueSpy: MockInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockXUsersController],
      providers: [
        BlockXUsersService,
        { provide: GroupsRepositoryToken, useClass: GroupsInMemoryRepository },
        { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersInMemoryRepository },
        { provide: BlockReasonsRepositoryToken, useClass: BlockReasonsInMemoryRepository },
      ],
    }).compile();

    blockXUserController = app.get<BlockXUsersController>(BlockXUsersController);
    blockXUsersService = app.get<BlockXUsersService>(BlockXUsersService);
    blockXUserSpy = vi.spyOn(blockXUsersService, 'blockXUser');
    blockXUserFromQueueSpy = vi.spyOn(blockXUsersService, 'blockXUserFromQueue');
    addXUserToBlockQueueSpy = vi.spyOn(blockXUsersService, 'addToBlockQueue');
  });

  describe('Block X user', () => {
    it('should block a X user', async () => {
      await blockXUserController.blockXUser({ sub: '1' }, getXUser(['1']));
      expect(blockXUserSpy).toHaveBeenCalledWith({
        xId: '1',
        xUsername: '@1-username',
        blockedAt: new Date('2024-05-27T18:01:45Z'),
        blockReasonIds: ['1'],
        blockingModorixUserId: '1',
      });
    });

    it('should not block a X user without reason', async () => {
      await expect(async () => {
        await blockXUserController.blockXUser({ sub: '1' }, getXUser([]));
      }).rejects.toThrow(new BadRequestException('could not block user "@1-username" because no reason was given'));
    });

    it('should not block a X user with non existing reason', async () => {
      await expect(async () => {
        await blockXUserController.blockXUser({ sub: '1' }, getXUser(['12']));
      }).rejects.toThrow(new BadRequestException('could not block user "@1-username" because at least one reason does not exist'));
    });
  });

  describe('Block X user from queue', () => {
    it('should block a X user', async () => {
      blockXUserFromQueueSpy.mockImplementationOnce(() => {});

      await blockXUserController.blockXUserFromQueue({ sub: '1' }, { xUserId: '862285194' });

      expect(blockXUserFromQueueSpy).toHaveBeenCalledWith('862285194', '1');
    });

    it('should not block a X user if he does not exist', async () => {
      blockXUserFromQueueSpy.mockImplementationOnce(() => {
        throw new XUserNotFoundError('2');
      });

      await expect(async () => {
        await blockXUserController.blockXUserFromQueue({ sub: '1' }, { xUserId: '2' });
      }).rejects.toThrow(new NotFoundException('X user with id "2" was not found'));
    });

    it("should not block a X user if he is not in Modorix user's block queue", async () => {
      blockXUserFromQueueSpy.mockImplementationOnce(() => {
        throw new XUserNotInQueueError('862285194');
      });

      await expect(async () => {
        await blockXUserController.blockXUserFromQueue({ sub: '1' }, { xUserId: '862285194' });
      }).rejects.toThrow(new BadRequestException('X user with id "862285194" is not in Modorix\'s user queue'));
    });
  });

  describe('Add a X user to block queue', () => {
    it('should add a X user to Modorix user block queue', async () => {
      addXUserToBlockQueueSpy.mockImplementationOnce(() => {});

      await blockXUserController.addXUserToBlockQueue({ sub: 'modorix-user-id' }, { xUserId: '862285194' });

      expect(addXUserToBlockQueueSpy).toHaveBeenCalledWith('862285194', 'modorix-user-id');
    });

    it("should not add X user to block queue if he hasn't been blocked by any Modorix user", async () => {
      await expect(async () => {
        await blockXUserController.addXUserToBlockQueue({ sub: 'modorix-user-id' }, { xUserId: '0' });
      }).rejects.toThrow(new NotFoundException('X user with id "0" was not found'));
    });
  });
});
