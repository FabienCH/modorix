import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const pgXUsers = pgTable('x-user', {
  id: uuid('id').primaryKey(),
  xId: text('x_id').notNull(),
  xUsername: text('x_username').notNull(),
  blockedAt: date('blocked_at').notNull(),
  blockReasonIds: text('block_reason_ids').array().notNull(),
});
