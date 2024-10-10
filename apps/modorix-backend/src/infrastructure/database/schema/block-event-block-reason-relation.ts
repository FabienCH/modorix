import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { pgBlockEvent } from './block-event';
import { pgBlockReasons } from './block-reason';

export const blockEventToBlockReasons = pgTable(
  'block_event_to_block_reasons',
  {
    eventId: uuid('block_event_id')
      .notNull()
      .references(() => pgBlockEvent.id),
    blockReasonId: uuid('blockReason_id')
      .notNull()
      .references(() => pgBlockReasons.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.blockReasonId] }),
  }),
);

export const blockEventRelations = relations(pgBlockEvent, ({ many }) => ({
  blockEventToBlockReasons: many(blockEventToBlockReasons),
}));

export const blockReasonsRelations = relations(pgBlockReasons, ({ many }) => ({
  blockEventToBlockReasons: many(blockEventToBlockReasons),
}));

export const blockEventToBlockReasonsRelations = relations(blockEventToBlockReasons, ({ one }) => ({
  blockReason: one(pgBlockReasons, {
    fields: [blockEventToBlockReasons.blockReasonId],
    references: [pgBlockReasons.id],
  }),
  blockEvent: one(pgBlockEvent, {
    fields: [blockEventToBlockReasons.eventId],
    references: [pgBlockEvent.id],
  }),
}));
