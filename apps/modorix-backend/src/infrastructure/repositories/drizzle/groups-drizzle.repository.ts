import { Group } from '@modorix-commons/domain/models/group';
import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray, sql } from 'drizzle-orm';
import { pgBlockEvent } from 'src/infrastructure/database/schema/block-event';
import { GroupsRepository } from '../../../domain/repositories/groups.repository';
import { PG_DATABASE } from '../../database/drizzle.module';
import { blockEventToGroups } from '../../database/schema/block-event-group-relation';
import { pgGroups } from '../../database/schema/group';
import { TypedNodePgDatabase } from '../../database/schema/schema';

@Injectable()
export class GroupsDrizzleRepository implements GroupsRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: TypedNodePgDatabase) {}

  async groupsList(modorixUserId: string | undefined): Promise<Group[]> {
    const groups = await this.pgDatabase.select().from(pgGroups);
    return Promise.all(groups.map(async (group) => this.mapPgGroupToGroup(group, modorixUserId)));
  }

  async groupsByIds(ids: string[], modorixUserId: string): Promise<Group[]> {
    const groups = ids.length
      ? await this.pgDatabase.select().from(pgGroups).where(inArray(pgGroups.id, ids))
      : await this.pgDatabase.select().from(pgGroups);
    return Promise.all(groups.map(async (group) => this.mapPgGroupToGroup(group, modorixUserId)));
  }

  async findGroupById(groupId: string, modorixUserId: string | undefined): Promise<Group | null> {
    const groups = await this.pgDatabase.select().from(pgGroups).where(eq(pgGroups.id, groupId));
    return this.mapPgGroupToGroup(groups[0], modorixUserId);
  }

  async joinGroup(groupId: string, modorixUserId: string): Promise<void | null> {
    const group = await this.pgDatabase.select().from(pgGroups).where(eq(pgGroups.id, groupId));
    if (!group) {
      return null;
    }

    await this.pgDatabase
      .update(pgGroups)
      .set({ isJoinedBy: sql`array_append(${pgGroups.isJoinedBy}, ${modorixUserId})` })
      .where(eq(pgGroups.id, groupId));
  }

  async leaveGroup(groupId: string, modorixUserId: string): Promise<void | null> {
    const group = await this.pgDatabase.select().from(pgGroups).where(eq(pgGroups.id, groupId));
    if (!group) {
      return null;
    }

    await this.pgDatabase
      .update(pgGroups)
      .set({ isJoinedBy: sql`array_remove(${pgGroups.isJoinedBy}, ${modorixUserId})` })
      .where(eq(pgGroups.id, groupId));
  }

  private async mapPgGroupToGroup(
    group: { id: string; name: string; description: string; isJoinedBy: string[] },
    modorixUserId: string | undefined,
  ): Promise<Group> {
    const blockEventIdOnGroup = await this.pgDatabase
      .select({ eventId: blockEventToGroups.eventId })
      .from(blockEventToGroups)
      .where(eq(blockEventToGroups.groupId, group.id));
    const blockedXUsers = await this.pgDatabase
      .select({ xUserId: pgBlockEvent.xUserId })
      .from(pgBlockEvent)
      .where(
        inArray(
          pgBlockEvent.id,
          blockEventIdOnGroup.map(({ eventId }) => eventId),
        ),
      );

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      blockedXUserIds: blockedXUsers.map(({ xUserId }) => xUserId),
      isJoined: !!group.isJoinedBy.find((id) => id === modorixUserId),
    };
  }
}
