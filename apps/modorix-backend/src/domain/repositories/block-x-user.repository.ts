import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { XUser } from '@modorix-commons/domain/models/x-user';

export const BlockXUsersRepositoryToken = Symbol('BlockXUsersRepositoryToken');

export interface BlockXUsersRepository {
  blockXUser(xUser: XUser): Promise<void>;
  addBlockEvent(xId: string, blockEvent: BlockEvent): Promise<void>;
  updateXUser(xUser: Omit<XUser, 'blockEvents'>, blockEvent?: BlockEvent): Promise<void>;
  blockedXUsersList(modorixUserId: string): Promise<XUser[]>;
  getAllBlockedXUsers(): Promise<XUser[]>;
  blockedXUsersByIds(ids: string[]): Promise<XUser[]>;
  blockedXUsersByXId(xId: string): Promise<XUser | undefined>;
}
