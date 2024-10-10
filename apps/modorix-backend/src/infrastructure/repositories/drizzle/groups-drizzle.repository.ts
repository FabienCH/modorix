import { Group } from '@modorix-commons/domain/models/group';
import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { pgBlockEvent } from 'src/infrastructure/database/schema/block-event';
import { GroupsRepository } from '../../../domain/repositories/groups.repository';
import { PG_DATABASE } from '../../database/drizzle.module';
import { blockEventToGroups } from '../../database/schema/block-event-group-relation';
import { pgGroups } from '../../database/schema/group';
import { TypedNodePgDatabase } from '../../database/schema/schema';

@Injectable()
export class GroupsDrizzleRepository implements GroupsRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: TypedNodePgDatabase) {}

  async groupsList(): Promise<Group[]> {
    const groups = await this.pgDatabase.select().from(pgGroups);
    return Promise.all(groups.map(async (group) => this.mapPgGroupToGroup(group)));
  }

  async groupsByIds(ids: string[]): Promise<Group[]> {
    const groups = ids.length
      ? await this.pgDatabase.select().from(pgGroups).where(inArray(pgGroups.id, ids))
      : await this.pgDatabase.select().from(pgGroups);
    return Promise.all(groups.map(async (group) => this.mapPgGroupToGroup(group)));
  }

  async findGroupById(groupId: string): Promise<Group | null> {
    const groups = await this.pgDatabase.select().from(pgGroups).where(eq(pgGroups.id, groupId));
    return this.mapPgGroupToGroup(groups[0]);
  }

  async updateIsJoined(groupId: string, isJoined: boolean): Promise<void> {
    await this.pgDatabase.update(pgGroups).set({ isJoined }).where(eq(pgGroups.id, groupId));
  }

  private async mapPgGroupToGroup(group: { id: string; name: string; description: string; isJoined: boolean }): Promise<Group> {
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

    return { ...group, blockedXUserIds: blockedXUsers.map(({ xUserId }) => xUserId) };
  }
}
