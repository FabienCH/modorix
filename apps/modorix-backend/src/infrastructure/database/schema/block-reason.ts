import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const pgBlockReasons = pgTable('block-reason', {
  id: uuid('id').primaryKey(),
  label: text('label').notNull(),
});
