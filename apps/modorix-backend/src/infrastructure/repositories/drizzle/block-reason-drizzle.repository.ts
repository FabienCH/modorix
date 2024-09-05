import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { Inject, Injectable } from '@nestjs/common';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BlockReasonsRepository } from '../../../domain/repositories/block-reason.repository';
import { PG_DATABASE } from '../../database/drizzle.module';
import { pgBlockReasons } from '../../database/schema/block-reason';

@Injectable()
export class BlockReasonsDrizzleRepository implements BlockReasonsRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: NodePgDatabase) {}

  blockedReasonsList(): Promise<BlockReason[]> {
    return this.pgDatabase.select().from(pgBlockReasons);
  }

  blockedReasonsByIds(ids: string[]): Promise<BlockReason[]> {
    return this.pgDatabase.select().from(pgBlockReasons).where(inArray(pgBlockReasons.id, ids));
  }
}
