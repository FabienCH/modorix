import { Group } from '@modorix-commons/domain/models/group';
import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { GroupsRepository } from '../../../domain/repositories/groups.repository';
import { PG_DATABASE } from '../../database/drizzle.module';
import { pgGroups } from '../../database/schema/group';
import { xUsersToGroups } from '../../database/schema/xUser-group-relation';

@Injectable()
export class GroupsDrizzleRepository implements GroupsRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: NodePgDatabase) {}

  async groupsList(): Promise<Group[]> {
    const groups = await this.pgDatabase.select().from(pgGroups);
    return Promise.all(groups.map(async (group) => this.mapPgGroupToGroup(group)));
  }

  async groupsByIds(ids: string[]): Promise<Group[]> {
    const groups = await this.pgDatabase.select().from(pgGroups).where(inArray(pgGroups.id, ids));
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
    const blockedXUsers = await this.pgDatabase
      .select({ userId: xUsersToGroups.userId })
      .from(xUsersToGroups)
      .where(eq(xUsersToGroups.groupId, group.id));
    return { ...group, blockedXUserIds: blockedXUsers.map(({ userId }) => userId) };
  }
}
