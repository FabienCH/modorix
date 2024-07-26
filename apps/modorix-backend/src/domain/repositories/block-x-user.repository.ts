import { XUser } from '@modorix-commons/models/x-user';

export const BlockXUsersRepositoryToken = Symbol('BlockXUsersRepositoryToken');

export interface BlockXUsersRepository {
  blockXUser(xUser: XUser): void;
  updateXUser(xUser: XUser): void;
  blockedXUsersList(modorixUserId: string): XUser[];
  getAllBlockedXUsers(): XUser[];
  blockedXUsersByIds(ids: string[]): XUser[];
  blockedXUsersById(id: string): XUser | undefined;
}
