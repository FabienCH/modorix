import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { pgGroups } from './group';
import { pgXUsers } from './xUser';

export const xUsersToGroups = pgTable(
  'x_users_to_groups',
  {
    userId: uuid('x_user_id')
      .notNull()
      .references(() => pgXUsers.id),
    groupId: uuid('group_id')
      .notNull()
      .references(() => pgGroups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  }),
);

export const xUsersRelations = relations(pgXUsers, ({ many }) => ({
  usersToGroups: many(xUsersToGroups),
}));

export const groupsRelations = relations(pgGroups, ({ many }) => ({
  usersToGroups: many(xUsersToGroups),
}));

export const xUsersToGroupsRelations = relations(xUsersToGroups, ({ one }) => ({
  group: one(pgGroups, {
    fields: [xUsersToGroups.groupId],
    references: [pgGroups.id],
  }),
  user: one(pgXUsers, {
    fields: [xUsersToGroups.userId],
    references: [pgXUsers.id],
  }),
}));
