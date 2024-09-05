import { XUser } from '@modorix-commons/domain/models/x-user';

export const BlockXUsersRepositoryToken = Symbol('BlockXUsersRepositoryToken');

export interface BlockXUsersRepository {
  blockXUser(xUser: XUser): Promise<void>;
  updateXUser(xUser: XUser): Promise<void>;
  blockedXUsersList(modorixUserId: string): Promise<XUser[]>;
  getAllBlockedXUsers(): Promise<XUser[]>;
  blockedXUsersByIds(ids: string[]): Promise<XUser[]>;
  blockedXUsersByXId(id: string): Promise<XUser | undefined>;
}
