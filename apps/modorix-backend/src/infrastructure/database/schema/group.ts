import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const pgGroups = pgTable('group', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  isJoined: boolean('is_joined').default(false),
});
