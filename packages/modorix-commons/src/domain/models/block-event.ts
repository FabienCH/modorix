import { BlockReason } from './block-reason';

export interface BlockEvent {
  modorixUserId: string;
  blockedAt: Date;
  blockReasons: BlockReason[];
  blockedInGroups: { id: string; name: string }[];
}
