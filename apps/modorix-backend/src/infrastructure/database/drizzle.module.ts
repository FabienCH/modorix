import { Module } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getEnvValue } from '../../get-env-value';

export const PG_DATABASE = Symbol('PG_DATABASE');

@Module({
  providers: [
    {
      provide: PG_DATABASE,
      useFactory: async () => {
        const pool = new Pool({
          connectionString: `postgresql://${getEnvValue('DB_USER')}:${getEnvValue('DB_PASSWORD')}@${getEnvValue('DB_HOST')}:6543/${getEnvValue('DB_NAME')}`,
          ssl: false,
        });

        const database: NodePgDatabase = drizzle(pool);
        return database;
      },
    },
  ],
  exports: [PG_DATABASE],
})
export class DrizzleModule {}
