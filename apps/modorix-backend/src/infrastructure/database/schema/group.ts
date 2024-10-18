import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const pgGroups = pgTable('group', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  isJoinedBy: uuid('is_joined_by').array().notNull().default([]),
});
