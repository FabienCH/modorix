import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockInstance } from 'vitest';
import { BlockXUsersRepositoryToken } from '../domain/repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../domain/repositories/groups.repository';
import { GroupsService } from '../domain/usecases/group.service';
import { BlockXUsersInMemoryRepository } from '../infrastructure/repositories/in-memory/block-x-user-in-memory.repository';
import { GroupsInMemoryRepository } from '../infrastructure/repositories/in-memory/groups-in-memory.repository';
import { GroupsController } from './group.controller';

describe('GroupsController', () => {
  let groupsController: GroupsController;
  let groupsService: GroupsService;
  let groupsListSpy: MockInstance;
  let findGroupSpy: MockInstance;
  let joinGroupSpy: MockInstance;
  let leaveGroupSpy: MockInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        GroupsService,
        { provide: GroupsRepositoryToken, useClass: GroupsInMemoryRepository },
        { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersInMemoryRepository },
      ],
    }).compile();

    groupsController = app.get<GroupsController>(GroupsController);
    groupsService = app.get<GroupsService>(GroupsService);
    groupsListSpy = vi.spyOn(groupsService, 'groupsList');
    findGroupSpy = vi.spyOn(groupsService, 'findGroupById');
    joinGroupSpy = vi.spyOn(groupsService, 'joinGroup');
    leaveGroupSpy = vi.spyOn(groupsService, 'leaveGroup');
  });

  describe('Get groups list', () => {
    it('should get a list of group', async () => {
      await groupsController.groupsList();
      expect(groupsListSpy).toHaveBeenCalledWith();
    });
  });

  describe('Find group by id', () => {
    it('should find the given group', async () => {
      await groupsController.groupById({ groupId: 'scientists' });
      expect(findGroupSpy).toHaveBeenCalledWith('scientists');
    });

    it('should not find a non existing group', async () => {
      await expect(async () => {
        await groupsController.joinGroup({ groupId: 'non existing id' });
      }).rejects.toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });

  describe('Join a group', () => {
    it('should join the given group', async () => {
      await groupsController.joinGroup({ groupId: 'UK' });
      expect(joinGroupSpy).toHaveBeenCalledWith('UK');
    });

    it('should not join a non existing group', async () => {
      await expect(async () => {
        await groupsController.joinGroup({ groupId: 'non existing id' });
      }).rejects.toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });

  describe('Join a group', () => {
    it('should join the given group', async () => {
      await groupsController.leaveGroup({ groupId: 'UK' });
      expect(leaveGroupSpy).toHaveBeenCalledWith('UK');
    });

    it('should not join a non existing group', async () => {
      await expect(async () => {
        await groupsController.leaveGroup({ groupId: 'non existing id' });
      }).rejects.toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });
});
