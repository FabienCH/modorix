import { BlockReason } from '@modorix-commons/models/block-reason';
import { Inject, Injectable } from '@nestjs/common';
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
}
