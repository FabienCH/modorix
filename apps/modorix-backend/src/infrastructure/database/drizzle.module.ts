import { Module } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getEnvValue } from '../../get-env-value';
import * as schema from './schema';

export const PG_CONNECTION = Symbol('PG_CONNECTION');

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      useFactory: async () => {
        const pool = new Pool({
          connectionString: `postgresql://${getEnvValue('DB_USER')}:${getEnvValue('DB_PASSWORD')}@${getEnvValue('DB_HOST')}:6543/${getEnvValue('DB_NAME')}`,
          ssl: false,
        });

        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
