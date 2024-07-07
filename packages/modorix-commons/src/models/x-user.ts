import { BlockReason } from './block-reason';

interface BaseXUser {
  id: string;
  blockedAt: string;
}

export interface BlockXUserRequest extends BaseXUser {
  id: string;
  blockedAt: string;
  blockReasonIds: string[];
  blockedInGroupsIds?: string[];
  blockingModorixUserId: string;
}

export interface XUser extends BaseXUser {
  blockReasons: BlockReason[];
  blockedInGroups?: { id: string; name: string }[];
  blockingModorixUserIds: string[];
  blockQueueModorixUserIds: string[];
}
