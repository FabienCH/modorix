import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from '../domain/group.service';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { GroupsController } from './group.controller';

describe('GroupsController', () => {
  let groupsController: GroupsController;
  let groupsRepository: GroupsRepository;
  let groupsListSpy: jest.SpyInstance;
  let updateIsJoinedGroupSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [GroupsService, GroupsRepository],
    }).compile();

    groupsController = app.get<GroupsController>(GroupsController);
    groupsRepository = app.get<GroupsRepository>(GroupsRepository);
    groupsListSpy = jest.spyOn(groupsRepository, 'groupsList');
    updateIsJoinedGroupSpy = jest.spyOn(groupsRepository, 'updateIsJoined');
  });

  describe('Get groups list', () => {
    it('should get a list of group"', () => {
      groupsController.groupsList();
      expect(groupsListSpy).toHaveBeenCalledWith();
    });
  });

  describe('Join a group', () => {
    it('should join the given group"', () => {
      groupsController.joinGroup({ groupId: 'UK' });
      expect(updateIsJoinedGroupSpy).toHaveBeenCalledWith('UK', true);
    });

    it('should not join a non existing group"', () => {
      expect(() => {
        groupsController.joinGroup({ groupId: 'non existing id' });
      }).toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });

  describe('Join a group', () => {
    it('should join the given group"', () => {
      groupsController.leaveGroup({ groupId: 'UK' });
      expect(updateIsJoinedGroupSpy).toHaveBeenCalledWith('UK', false);
    });

    it('should not join a non existing group"', () => {
      expect(() => {
        groupsController.leaveGroup({ groupId: 'non existing id' });
      }).toThrow(new NotFoundException('group with id "non existing id" was not found'));
    });
  });
});
