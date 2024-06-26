import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from '../domain/group.service';
import { BlockUsersRepository } from '../infrastructure/block-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { GroupsController } from './group.controller';

describe('GroupsController', () => {
  let groupsController: GroupsController;
  let groupsService: GroupsService;
  let groupsListSpy: jest.SpyInstance;
  let findGroupSpy: jest.SpyInstance;
  let joinGroupSpy: jest.SpyInstance;
  let leaveGroupSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [GroupsService, GroupsRepository, BlockUsersRepository],
    }).compile();

    groupsController = app.get<GroupsController>(GroupsController);
    groupsService = app.get<GroupsService>(GroupsService);
    groupsListSpy = jest.spyOn(groupsService, 'groupsList');
    findGroupSpy = jest.spyOn(groupsService, 'findGroupById');
    joinGroupSpy = jest.spyOn(groupsService, 'joinGroup');
    leaveGroupSpy = jest.spyOn(groupsService, 'leaveGroup');
  });

  describe('Get groups list', () => {
    it('should get a list of group', () => {
      groupsController.groupsList();
      expect(groupsListSpy).toHaveBeenCalledWith();
    });
  });

  describe('Find group by id', () => {
    it('should find the given group', () => {
      groupsController.groupById({ groupId: 'scientists' });
      expect(findGroupSpy).toHaveBeenCalledWith('scientists');
    });

    it('should not find a non existing group', () => {
      expect(() => {
        groupsController.joinGroup({ groupId: 'non existing id' });
      }).toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });

  describe('Join a group', () => {
    it('should join the given group', () => {
      groupsController.joinGroup({ groupId: 'UK' });
      expect(joinGroupSpy).toHaveBeenCalledWith('UK');
    });

    it('should not join a non existing group', () => {
      expect(() => {
        groupsController.joinGroup({ groupId: 'non existing id' });
      }).toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });

  describe('Join a group', () => {
    it('should join the given group', () => {
      groupsController.leaveGroup({ groupId: 'UK' });
      expect(leaveGroupSpy).toHaveBeenCalledWith('UK');
    });

    it('should not join a non existing group', () => {
      expect(() => {
        groupsController.leaveGroup({ groupId: 'non existing id' });
      }).toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });
});
