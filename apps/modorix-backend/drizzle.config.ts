import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import * as helper from './src/get-env-value';

const ENV = process.env.NODE_ENV;

dotenv.config({
  path: !ENV ? '.env' : `${ENV}.env`,
});

export default defineConfig({
  schema: ['./src/infrastructure/database/schema/schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: helper.getEnvValue('DB_HOST'),
    user: helper.getEnvValue('DB_USER'),
    password: helper.getEnvValue('DB_PASSWORD'),
    database: helper.getEnvValue('DB_NAME'),
    ssl: false,
  },
});
