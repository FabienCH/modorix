import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { pgBlockReasons } from './block-reason';
import { pgXUsers } from './xUser';

export const xUsersToBlockReasons = pgTable(
  'x_users_to_block_reasons',
  {
    userId: uuid('x_user_id')
      .notNull()
      .references(() => pgXUsers.id),
    blockReasonId: uuid('blockReason_id')
      .notNull()
      .references(() => pgBlockReasons.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.blockReasonId] }),
  }),
);

export const xUsersRelations = relations(pgXUsers, ({ many }) => ({
  usersToBlockReasons: many(xUsersToBlockReasons),
}));

export const blockReasonsRelations = relations(pgBlockReasons, ({ many }) => ({
  usersToBlockReasons: many(xUsersToBlockReasons),
}));

export const xUsersToBlockReasonsRelations = relations(xUsersToBlockReasons, ({ one }) => ({
  blockReason: one(pgBlockReasons, {
    fields: [xUsersToBlockReasons.blockReasonId],
    references: [pgBlockReasons.id],
  }),
  user: one(pgXUsers, {
    fields: [xUsersToBlockReasons.userId],
    references: [pgXUsers.id],
  }),
}));
