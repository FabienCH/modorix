import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { pgBlockEvent } from './block-event';
import { pgGroups } from './group';

export const blockEventToGroups = pgTable(
  'block_event_to_groups',
  {
    eventId: uuid('block_event_id')
      .notNull()
      .references(() => pgBlockEvent.id),
    groupId: uuid('group_id')
      .notNull()
      .references(() => pgGroups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.groupId] }),
  }),
);

export const blockEventRelations = relations(pgBlockEvent, ({ many }) => ({
  blockEventToGroups: many(blockEventToGroups),
}));

export const groupsRelations = relations(pgGroups, ({ many }) => ({
  blockEventToGroups: many(blockEventToGroups),
}));

export const blockEventToGroupsRelations = relations(blockEventToGroups, ({ one }) => ({
  group: one(pgGroups, {
    fields: [blockEventToGroups.groupId],
    references: [pgGroups.id],
  }),
  blockEvent: one(pgBlockEvent, {
    fields: [blockEventToGroups.eventId],
    references: [pgBlockEvent.id],
  }),
}));
