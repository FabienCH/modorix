import { relations } from 'drizzle-orm';
import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { pgXUsers } from './x-user';

export const pgBlockEvent = pgTable('block-event', {
  id: uuid('id').primaryKey(),
  xUserId: text('x_user_id').notNull(),
  modorixUserId: text('modorix_user_id').notNull(),
  blockedAt: date('blocked_at').notNull(),
});

export const blockEventRelations = relations(pgBlockEvent, ({ one }) => ({
  xUser: one(pgXUsers, {
    fields: [pgBlockEvent.xUserId],
    references: [pgXUsers.id],
  }),
}));
