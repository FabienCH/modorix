import { XUser } from '@modorix-commons/models/x-user';
import { Inject, Injectable } from '@nestjs/common';
import { arrayContains, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { pgBlockReasons } from 'src/infrastructure/database/schema/block-reason';
import { BlockXUsersRepository } from '../../../domain/repositories/block-x-user.repository';
import { PG_DATABASE } from '../../database/drizzle.module';
import { pgGroups } from '../../database/schema/group';
import { pgXUsers } from '../../database/schema/xUser';
import { xUsersToBlockReasons } from '../../database/schema/xUser-block-reason-relation';
import { xUsersToGroups } from '../../database/schema/xUser-group-relation';

@Injectable()
export class BlockXUsersDrizzleRepository implements BlockXUsersRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: NodePgDatabase) {}

  async blockXUser(xUser: XUser): Promise<void> {
    const { xId, xUsername, blockedAt, blockingModorixUserIds, blockQueueModorixUserIds, blockedInGroups, blockReasons } = xUser;
    const id = crypto.randomUUID();
    await this.pgDatabase.insert(pgXUsers).values({ id, xId, xUsername, blockedAt, blockingModorixUserIds, blockQueueModorixUserIds });
    const groups = await this.pgDatabase.select().from(pgGroups);
    const xUsersToGroupsValues = groups
      .filter((group) => !blockedInGroups || blockedInGroups.find((blockedGrp) => blockedGrp.id === group.id))
      .map((group) => ({
        userId: id,
        groupId: group.id,
      }));
    await this.pgDatabase.insert(xUsersToGroups).values(xUsersToGroupsValues);
    await this.pgDatabase
      .insert(xUsersToBlockReasons)
      .values(blockReasons.map((blockReason) => ({ blockReasonId: blockReason.id, userId: id })));
  }

  async updateXUser(xUser: XUser): Promise<void> {
    const { xId, xUsername, blockedAt, blockingModorixUserIds, blockQueueModorixUserIds } = xUser;
    await this.pgDatabase
      .update(pgXUsers)
      .set({ xId, xUsername, blockedAt, blockingModorixUserIds, blockQueueModorixUserIds })
      .where(eq(pgXUsers.xId, xUser.xId));
  }

  async blockedXUsersList(modorixUserId: string): Promise<XUser[]> {
    const xUsers = await this.pgDatabase
      .select()
      .from(pgXUsers)
      .where(arrayContains(pgXUsers.blockingModorixUserIds, [modorixUserId]));
    return Promise.all(xUsers.map(async (xUser) => await this.mapPgUserToXUser(xUser)));
  }

  async getAllBlockedXUsers(): Promise<XUser[]> {
    const xUsers = await this.pgDatabase.select().from(pgXUsers);
    return Promise.all(xUsers.map(async (xUser) => await this.mapPgUserToXUser(xUser)));
  }

  async blockedXUsersByIds(ids: string[]): Promise<XUser[]> {
    const xUsers = await this.pgDatabase.select().from(pgXUsers).where(inArray(pgXUsers.id, ids));
    return Promise.all(xUsers.map(async (xUser) => await this.mapPgUserToXUser(xUser)));
  }

  async blockedXUsersByXId(xId: string): Promise<XUser | undefined> {
    const xUsers = await this.pgDatabase.select().from(pgXUsers).where(eq(pgXUsers.xId, xId));
    return this.mapPgUserToXUser(xUsers[0]);
  }

  private async mapPgUserToXUser(xUser: {
    id: string;
    xId: string;
    xUsername: string;
    blockedAt: string;
    blockingModorixUserIds: string[];
    blockQueueModorixUserIds: string[];
  }) {
    const blockReasons = await this.pgDatabase
      .select({ id: pgBlockReasons.id, label: pgBlockReasons.label })
      .from(pgBlockReasons)
      .innerJoin(xUsersToBlockReasons, eq(pgBlockReasons.id, xUsersToBlockReasons.blockReasonId))
      .where(eq(xUsersToBlockReasons.userId, xUser.id));
    const groups = await this.pgDatabase
      .select({ id: pgGroups.id, name: pgGroups.name })
      .from(pgGroups)
      .innerJoin(xUsersToGroups, eq(pgGroups.id, xUsersToGroups.groupId))
      .where(eq(xUsersToGroups.userId, xUser.id));
    return { ...xUser, blockReasons, blockedInGroups: groups };
  }
}
