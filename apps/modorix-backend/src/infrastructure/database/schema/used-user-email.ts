import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const pgUsedUserEmail = pgTable('used-user-email', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
});
