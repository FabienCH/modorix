import { defineConfig } from 'drizzle-kit';
import { getEnvValue } from 'src/get-env-value';

export default defineConfig({
  schema: ['./src/infrastructure/database/schema/xUser.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: getEnvValue('DB_HOST'),
    user: getEnvValue('DB_USER'),
    password: getEnvValue('DB_PASSWORD'),
    database: getEnvValue('DB_NAME'),
    ssl: false,
  },
});
