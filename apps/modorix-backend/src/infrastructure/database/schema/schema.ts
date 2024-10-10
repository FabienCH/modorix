import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as blockEvent from './block-event';
import * as blockEventBlockReasonRelations from './block-event-block-reason-relation';
import * as blockEventGroupRelations from './block-event-group-relation';
import * as blockReason from './block-reason';
import * as group from './group';
import * as usedUserEmail from './used-user-email';
import * as xUser from './x-user';

export const databaseSchema = {
  ...blockEventBlockReasonRelations,
  ...blockEventGroupRelations,
  ...blockEvent,
  ...blockReason,
  ...group,
  ...usedUserEmail,
  ...xUser,
};

export type TypedNodePgDatabase = NodePgDatabase<typeof databaseSchema>;
