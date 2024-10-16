import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { pgBlockEvent } from './block-event';

export const pgXUsers = pgTable('x-user', {
  id: uuid('id').primaryKey(),
  xId: text('x_id').notNull().unique(),
  xUsername: text('x_username').notNull(),
  blockQueueModorixUserIds: text('block_queue_modorix_user_ids').array().notNull(),
});

export const xUsersRelations = relations(pgXUsers, ({ many }) => ({
  events: many(pgBlockEvent),
}));
