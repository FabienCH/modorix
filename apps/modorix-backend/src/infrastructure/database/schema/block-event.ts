import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pgXUsers } from './x-user';

export const pgBlockEvent = pgTable('block-event', {
  id: uuid('id').primaryKey(),
  xUserId: uuid('x_user_id').notNull(),
  modorixUserId: uuid('modorix_user_id').notNull(),
  blockedAt: timestamp('blocked_at').notNull(),
});

export const blockEventRelations = relations(pgBlockEvent, ({ one }) => ({
  xUser: one(pgXUsers, {
    fields: [pgBlockEvent.xUserId],
    references: [pgXUsers.id],
  }),
}));
