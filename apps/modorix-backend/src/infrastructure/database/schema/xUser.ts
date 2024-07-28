import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const pgXUsers = pgTable('x-user', {
  id: uuid('id').primaryKey(),
  xId: text('x_id').notNull().unique(),
  xUsername: text('x_username').notNull(),
  blockedAt: date('blocked_at').notNull(),
  blockingModorixUserIds: text('blocking_modorix_user_ids').array().notNull(),
  blockQueueModorixUserIds: text('block_queue_modorix_user_ids').array().notNull(),
});
