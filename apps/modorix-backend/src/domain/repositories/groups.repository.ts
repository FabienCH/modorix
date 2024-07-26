import { Group } from '@modorix-commons/models/group';

export const GroupsRepositoryToken = Symbol('GroupsRepositoryToken');

export interface GroupsRepository {
  groupsList(): Group[];
  findGroupById(groupId: string): Group | null;
  updateIsJoined(groupId: string, isJoined: boolean): void | null;
  addBlockedUser(groupId: string, blockedUserId: string): void;
}
