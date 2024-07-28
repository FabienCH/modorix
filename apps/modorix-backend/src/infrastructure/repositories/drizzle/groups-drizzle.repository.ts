import { Group } from '@modorix-commons/models/group';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { GroupsRepository } from '../../../domain/repositories/groups.repository';
import { PG_DATABASE } from '../../database/drizzle.module';
import { pgGroups } from '../../database/schema/group';
import { pgXUsers } from '../../database/schema/xUser';
import { xUsersToGroups } from '../../database/schema/xUser-group-relation';

@Injectable()
export class GroupsDrizzleRepository implements GroupsRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: NodePgDatabase) {}

  async groupsList(): Promise<Group[]> {
    const groups = await this.pgDatabase.select().from(pgGroups);
    const groupsWithXUsersIds = await Promise.all(
      groups.map(async (group) => {
        const blockedXUsers = await this.pgDatabase
          .select({ userId: xUsersToGroups.userId })
          .from(xUsersToGroups)
          .where(eq(xUsersToGroups.groupId, group.id));
        return { ...group, blockedXUserIds: blockedXUsers.map(({ userId }) => userId) };
      }),
    );

    return groupsWithXUsersIds;
  }

  async findGroupById(groupId: string): Promise<Group | null> {
    const groups = await this.pgDatabase.select().from(pgGroups).where(eq(pgGroups.id, groupId));
    const blockedXUsers = await this.pgDatabase.select({ id: pgXUsers.id }).from(pgXUsers);
    return { ...groups[0], blockedXUserIds: blockedXUsers.map(({ id }) => id) };
  }

  async updateIsJoined(groupId: string, isJoined: boolean): Promise<void> {
    await this.pgDatabase.update(pgGroups).set({ isJoined }).where(eq(pgGroups.id, groupId));
  }
}
