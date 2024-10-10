import { BlockReason } from './block-reason';

export interface BlockEvent {
  modorixUserId: string;
  blockedAt: string;
  blockReasons: BlockReason[];
  blockedInGroups: { id: string; name: string }[];
}
