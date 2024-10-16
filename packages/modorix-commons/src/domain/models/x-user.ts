import { BlockEvent } from './block-event';

interface BaseXUser {
  xId: string;
  xUsername: string;
}

export interface BlockXUserRequest extends BaseXUser {
  blockedAt: string;
  blockReasonIds: string[];
  blockedInGroupsIds: string[];
}

export interface BlockXUser extends Omit<BlockXUserRequest, 'blockedAt'> {
  blockedAt: Date;
  blockingModorixUserId: string;
}

export interface XUser extends BaseXUser {
  blockEvents: BlockEvent[];
  blockQueueModorixUserIds: string[];
}
