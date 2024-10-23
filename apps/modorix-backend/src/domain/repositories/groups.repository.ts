import { Group } from '@modorix-commons/domain/models/group';

export const GroupsRepositoryToken = Symbol('GroupsRepositoryToken');

export interface GroupsRepository {
  groupsList(modorixUserId: string | undefined): Promise<Group[]>;
  groupsByIds(ids: string[], modorixUserId: string): Promise<Group[]>;
  findGroupWithMembersById(groupId: string, modorixUserId: string | undefined): Promise<(Group & { membersCount: number }) | null>;
  joinGroup(groupId: string, modorixUserId: string): Promise<void | null>;
  leaveGroup(groupId: string, modorixUserId: string): Promise<void | null>;
}
