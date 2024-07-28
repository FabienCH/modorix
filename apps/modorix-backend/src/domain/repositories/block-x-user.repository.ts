import { XUser } from '@modorix-commons/models/x-user';

export const BlockXUsersRepositoryToken = Symbol('BlockXUsersRepositoryToken');

export interface BlockXUsersRepository {
  blockXUser(xUser: XUser): void;
  updateXUser(xUser: XUser): void;
  blockedXUsersList(modorixUserId: string): Promise<XUser[]>;
  getAllBlockedXUsers(): Promise<XUser[]>;
  blockedXUsersByIds(ids: string[]): Promise<XUser[]>;
  blockedXUsersByXId(id: string): Promise<XUser | undefined>;
}
