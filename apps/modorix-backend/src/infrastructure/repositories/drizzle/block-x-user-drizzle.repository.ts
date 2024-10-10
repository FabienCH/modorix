import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { XUser } from '@modorix-commons/domain/models/x-user';
import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { pgBlockEvent } from 'src/infrastructure/database/schema/block-event';
import { BlockXUsersRepository } from '../../../domain/repositories/block-x-user.repository';
import { PG_DATABASE } from '../../database/drizzle.module';
import { blockEventToBlockReasons } from '../../database/schema/block-event-block-reason-relation';
import { blockEventToGroups } from '../../database/schema/block-event-group-relation';
import { pgBlockReasons } from '../../database/schema/block-reason';
import { pgGroups } from '../../database/schema/group';
import { TypedNodePgDatabase } from '../../database/schema/schema';
import { pgXUsers } from '../../database/schema/x-user';

@Injectable()
export class BlockXUsersDrizzleRepository implements BlockXUsersRepository {
  constructor(@Inject(PG_DATABASE) private pgDatabase: TypedNodePgDatabase) {}
  async blockXUser(xUser: XUser): Promise<void> {
    const blockEvent = xUser.blockEvents[0];
    const id = crypto.randomUUID();
    await this.insertXUser(id, xUser);
    await this.insertBlockEvent(xUser.xId, blockEvent);
    await this.insertBlockedInGroups(blockEvent.blockedInGroups, id);
    await this.insertBlockReasons(blockEvent.blockReasons, id);
  }

  async addBlockEvent(xUserId: string, blockEvent: BlockEvent): Promise<void> {
    await this.insertBlockEvent(xUserId, blockEvent);
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
    const xUsers = await this.pgDatabase.query.pgXUsers.findMany({
      with: {
        events: true,
      },
      where: eq(pgBlockEvent.modorixUserId, modorixUserId),
    });

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

  private async insertXUser(id: string, xUser: XUser) {
    const { xId, xUsername, blockQueueModorixUserIds } = xUser;
    await this.pgDatabase.insert(pgXUsers).values({ id, xId, xUsername, blockQueueModorixUserIds });
  }

  private async insertBlockEvent(xUserId: string, blockEvent: BlockEvent) {
    await this.pgDatabase.insert(pgBlockEvent).values({
      id: crypto.randomUUID(),
      xUserId,
      modorixUserId: blockEvent.modorixUserId,
      blockedAt: blockEvent.blockedAt,
    });
  }

  private async insertBlockedInGroups(blockedInGroups: { id: string; name: string }[] | undefined, id: string) {
    const groups = await this.pgDatabase
      .select({ id: pgGroups.id })
      .from(pgGroups)
      .where(
        inArray(
          pgGroups.id,
          (blockedInGroups ?? []).map(({ id }) => id),
        ),
      );
    await this.pgDatabase.insert(blockEventToGroups).values(groups.map((group) => ({ eventId: id, groupId: group.id })));
  }

  private async insertBlockReasons(blockReasons: BlockReason[], id: string) {
    await this.pgDatabase
      .insert(blockEventToBlockReasons)
      .values(blockReasons.map((blockReason) => ({ blockReasonId: blockReason.id, eventId: id })));
  }

  private async mapPgUserToXUser(xUser: {
    id: string;
    xId: string;
    xUsername: string;
    blockQueueModorixUserIds: string[];
  }): Promise<XUser> {
    const dbBlockEvents = await this.pgDatabase.select().from(pgBlockEvent).where(eq(pgBlockEvent.modorixUserId, xUser.id));
    const blockEventIds = dbBlockEvents.map((blockEvent) => blockEvent.id);

    const blockReasons = await this.pgDatabase
      .select({ id: pgBlockReasons.id, label: pgBlockReasons.label })
      .from(pgBlockReasons)
      .innerJoin(blockEventToBlockReasons, eq(pgBlockReasons.id, blockEventToBlockReasons.blockReasonId))
      .where(inArray(blockEventToBlockReasons.eventId, blockEventIds));
    const groups = await this.pgDatabase
      .select({ id: pgGroups.id, name: pgGroups.name })
      .from(pgGroups)
      .innerJoin(blockEventToGroups, eq(pgGroups.id, blockEventToGroups.groupId))
      .where(inArray(blockEventToBlockReasons.eventId, blockEventIds));

    const blockEvents = dbBlockEvents.map((dbBlockEvent) => {
      return { modorixUserId: dbBlockEvent.modorixUserId, blockedAt: dbBlockEvent.blockedAt, blockReasons, blockedInGroups: groups };
    });
    return { xId: xUser.xId, xUsername: xUser.xUsername, blockEvents, blockQueueModorixUserIds: xUser.blockQueueModorixUserIds };
  }
}
