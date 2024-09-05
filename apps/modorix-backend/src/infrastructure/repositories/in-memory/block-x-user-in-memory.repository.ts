import { XUser } from '@modorix-commons/domain/models/x-user';
import { Injectable } from '@nestjs/common';
import { BlockXUsersRepository } from '../../../domain/repositories/block-x-user.repository';

@Injectable()
export class BlockXUsersInMemoryRepository implements BlockXUsersRepository {
  private blockedXUsers: XUser[];

  constructor() {
    this.blockedXUsers = [];
  }

  async blockXUser(xUser: XUser): Promise<void> {
    this.blockedXUsers.push(xUser);
    return;
  }

  async updateXUser(xUser: XUser): Promise<void> {
    this.blockedXUsers = this.blockedXUsers.map((currentXUser) => {
      if (currentXUser.xId === xUser.xId) {
        currentXUser = xUser;
      }
      return currentXUser;
    });
    return;
  }

  async blockedXUsersList(modorixUserId: string): Promise<XUser[]> {
    return this.blockedXUsers.filter((blockedXUser) => blockedXUser.blockingModorixUserIds.includes(modorixUserId));
  }

  async getAllBlockedXUsers(): Promise<XUser[]> {
    return this.blockedXUsers;
  }

  async blockedXUsersByIds(ids: string[]): Promise<XUser[]> {
    return this.blockedXUsers.filter((blockedUser) => ids.includes(blockedUser.xId));
  }

  async blockedXUsersByXId(id: string): Promise<XUser | undefined> {
    return this.blockedXUsers.find((blockedUser) => blockedUser.xId === id);
  }
}
