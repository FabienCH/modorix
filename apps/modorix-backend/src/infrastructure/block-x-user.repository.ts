import { XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockXUsersRepository {
  private blockedXUsers: XUser[];

  constructor() {
    this.blockedXUsers = [];
  }

  blockXUser(xUser: XUser): void {
    this.blockedXUsers.push(xUser);
  }

  updateXUser(xUser: XUser): void {
    this.blockedXUsers = this.blockedXUsers.map((currentXUser) => {
      if (currentXUser.xId === xUser.xId) {
        currentXUser = xUser;
      }
      return currentXUser;
    });
  }

  blockedXUsersList(modorixUserId: string): XUser[] {
    return this.blockedXUsers.filter((blockedXUser) => blockedXUser.blockingModorixUserIds.includes(modorixUserId));
  }

  getAllBlockedXUsers(): XUser[] {
    return this.blockedXUsers;
  }

  blockedXUsersByIds(ids: string[]): XUser[] {
    return this.blockedXUsers.filter((blockedUser) => ids.includes(blockedUser.xId));
  }

  blockedXUsersById(id: string): XUser | undefined {
    return this.blockedXUsers.find((blockedUser) => blockedUser.xId === id);
  }
}
