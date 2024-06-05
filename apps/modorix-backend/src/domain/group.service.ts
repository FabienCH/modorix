import { Group } from '@modorix-commons/models/group';
import { Injectable } from '@nestjs/common';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { GroupNotFoundError } from './errors/group-not-found-error';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  groupsList(): Group[] {
    return this.groupsRepository.groupsList();
  }

  joinGroup(groupId: string): void {
    const joinStatusUpdated = this.groupsRepository.updateIsJoined(groupId, true);
    if (joinStatusUpdated === null) {
      throw new GroupNotFoundError(groupId);
    }
  }

  leaveGroup(groupId: string): void {
    const joinStatusUpdated = this.groupsRepository.updateIsJoined(groupId, false);
    if (joinStatusUpdated === null) {
      throw new GroupNotFoundError(groupId);
    }
  }
}
