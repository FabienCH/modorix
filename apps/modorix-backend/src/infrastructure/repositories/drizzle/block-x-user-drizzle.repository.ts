import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { XUser } from '@modorix-commons/domain/models/x-user';
import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray, sql } from 'drizzle-orm';
import { BlockXUsersRepository } from '../../../domain/repositories/block-x-user.repository';
import { pgBlockEvent } from '../../../infrastructure/database/schema/block-event';
import { PG_DATABASE } from '../../database/drizzle.module';
import { blockEventToBlockReasons } from '../../database/schema/block-event-block-reason-relation';
import { blockEventToGroups } from '../../database/schema/block-event-group-relation';
import { pgBlockReasons } from '../../database/schema/block-reason';
import { pgGroups } from '../../database/schema/group';
import { TypedNodePgDatabase } from '../../database/schema/schema';
import { pgXUsers } from '../../database/schema/x-user';

interface DbXUserBlockEvent {
  id: string;
  modorixUserId: string;
  blockedAt: Date;
}

@Injectable()
export class BlockXUsersDrizzleRepository implements BlockXUsersRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: TypedNodePgDatabase) {}

  async blockXUser(xUser: XUser): Promise<void> {
    const blockEvent = xUser.blockEvents[0];
    const xUserId = crypto.randomUUID();
    await this.insertXUser(xUserId, xUser);
    await this.addBlockEvent(xUser.xId, blockEvent);
  }

  async addBlockEvent(xId: string, blockEvent: BlockEvent): Promise<void> {
    const eventId = crypto.randomUUID();
    const xUserIds = await this.pgDatabase.select({ id: pgXUsers.id }).from(pgXUsers).where(eq(pgXUsers.xId, xId));
    await this.insertBlockEvent(xUserIds[0].id, { ...blockEvent, id: eventId });
    await this.insertBlockedInGroups(blockEvent.blockedInGroups, eventId);
    await this.insertBlockReasons(blockEvent.blockReasons, eventId);
  }

  async updateXUser(xUser: Omit<XUser, 'blockEvents'>, blockEvent?: BlockEvent): Promise<void> {
    await this.pgDatabase
      .update(pgXUsers)
      .set({ ...xUser })
      .where(eq(pgXUsers.xId, xUser.xId));

    if (blockEvent) {
      this.addBlockEvent(xUser.xId, blockEvent);
    }
  }

  async blockedXUsersList(modorixUserId: string): Promise<XUser[]> {
    const xUsers = await this.selectXUserWithEvents().where(eq(pgBlockEvent.modorixUserId, modorixUserId)).groupBy(pgXUsers.id);

    return Promise.all(xUsers.map(async (xUser) => await this.mapPgUserToXUser(xUser)));
  }

  async getAllBlockedXUsers(): Promise<XUser[]> {
    const xUsers = await this.selectXUserWithEvents().groupBy(pgXUsers.id);
    return Promise.all(xUsers.map(async (xUser) => await this.mapPgUserToXUser(xUser)));
  }

  async blockedXUsersByIds(ids: string[]): Promise<XUser[]> {
    const xUsers = await this.selectXUserWithEvents().where(inArray(pgXUsers.id, ids)).groupBy(pgXUsers.id);

    return Promise.all(xUsers.map(async (xUser) => await this.mapPgUserToXUser(xUser)));
  }

  async blockedXUserByXId(xId: string): Promise<XUser | undefined> {
    const xUsers = await this.selectXUserWithEvents().where(eq(pgXUsers.xId, xId)).groupBy(pgXUsers.id);

    if (!xUsers.length) {
      return undefined;
    }

    return this.mapPgUserToXUser(xUsers[0]);
  }

  private selectXUserWithEvents() {
    return this.pgDatabase
      .select({
        xId: pgXUsers.xId,
        xUsername: pgXUsers.xUsername,
        blockQueueModorixUserIds: pgXUsers.blockQueueModorixUserIds,
        blockEvents: sql<
          DbXUserBlockEvent[]
        >`json_agg(json_build_object('id', ${pgBlockEvent.id},  'modorixUserId', ${pgBlockEvent.modorixUserId}, 'blockedAt', ${pgBlockEvent.blockedAt}))`.as(
          'blockEvents',
        ),
      })
      .from(pgXUsers)
      .innerJoin(pgBlockEvent, eq(pgBlockEvent.xUserId, pgXUsers.id));
  }

  private async insertXUser(id: string, xUser: XUser) {
    const { xId, xUsername, blockQueueModorixUserIds } = xUser;
    await this.pgDatabase.insert(pgXUsers).values({ id, xId, xUsername, blockQueueModorixUserIds });
  }

  private async insertBlockEvent(xUserId: string, blockEvent: BlockEvent & { id: string }) {
    await this.pgDatabase.insert(pgBlockEvent).values({
      id: blockEvent.id,
      xUserId,
      modorixUserId: blockEvent.modorixUserId,
      blockedAt: blockEvent.blockedAt,
    });
  }

  private async insertBlockedInGroups(blockedInGroups: { id: string; name: string }[] | undefined, eventId: string) {
    const groups = await this.pgDatabase
      .select({ id: pgGroups.id })
      .from(pgGroups)
      .where(
        inArray(
          pgGroups.id,
          (blockedInGroups ?? []).map(({ id }) => id),
        ),
      );
    await this.pgDatabase.insert(blockEventToGroups).values(groups.map((group) => ({ eventId, groupId: group.id })));
  }

  private async insertBlockReasons(blockReasons: BlockReason[], eventId: string) {
    await this.pgDatabase
      .insert(blockEventToBlockReasons)
      .values(blockReasons.map((blockReason) => ({ blockReasonId: blockReason.id, eventId })));
  }

  private async mapPgUserToXUser(xUser: {
    xId: string;
    xUsername: string;
    blockQueueModorixUserIds: string[];
    blockEvents: DbXUserBlockEvent[];
  }): Promise<XUser> {
    const blockEventIds = xUser.blockEvents.map((event) => event.id);

    const blockReasons = await this.pgDatabase
      .select({ id: pgBlockReasons.id, label: pgBlockReasons.label })
      .from(pgBlockReasons)
      .innerJoin(blockEventToBlockReasons, eq(pgBlockReasons.id, blockEventToBlockReasons.blockReasonId))
      .where(inArray(blockEventToBlockReasons.eventId, blockEventIds));
    const groups = await this.pgDatabase
      .select({ id: pgGroups.id, name: pgGroups.name })
      .from(pgGroups)
      .innerJoin(blockEventToGroups, eq(pgGroups.id, blockEventToGroups.groupId))
      .where(inArray(blockEventToGroups.eventId, blockEventIds));

    const blockEvents = xUser.blockEvents.map((dbBlockEvent) => ({
      modorixUserId: dbBlockEvent.modorixUserId,
      blockedAt: dbBlockEvent.blockedAt,
      blockReasons,
      blockedInGroups: groups,
    }));

    return { xId: xUser.xId, xUsername: xUser.xUsername, blockEvents, blockQueueModorixUserIds: xUser.blockQueueModorixUserIds };
  }
}
