import { BlockReason } from './block-reason';

interface BaseXUser {
  id: string;
  blockedAt: string;
}

export interface BlockXUserRequest extends BaseXUser {
  id: string;
  blockedAt: string;
  blockReasonIds: string[];
}

export interface XUser extends BaseXUser {
  blockReasons: BlockReason[];
}
