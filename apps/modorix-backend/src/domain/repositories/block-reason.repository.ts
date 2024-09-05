import { BlockReason } from '@modorix-commons/domain/models/block-reason';

export const BlockReasonsRepositoryToken = Symbol('BlockReasonsRepositoryToken');

export interface BlockReasonsRepository {
  blockedReasonsList(): Promise<BlockReason[]>;
  blockedReasonsByIds(ids: string[]): Promise<BlockReason[]>;
}
