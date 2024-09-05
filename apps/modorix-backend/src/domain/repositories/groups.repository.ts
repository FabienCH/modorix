import { Group } from '@modorix-commons/domain/models/group';

export const GroupsRepositoryToken = Symbol('GroupsRepositoryToken');

export interface GroupsRepository {
  groupsList(): Promise<Group[]>;
  groupsByIds(ids: string[]): Promise<Group[]>;
  findGroupById(groupId: string): Promise<Group | null>;
  updateIsJoined(groupId: string, isJoined: boolean): Promise<void | null>;
}
