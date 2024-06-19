import { XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockXUsersRepository {
  private readonly blockedXUsers: XUser[] = [];

  blockXUser(xUser: XUser): void {
    this.blockedXUsers.push(xUser);
  }

  blockedXUsersList(): XUser[] {
    return this.blockedXUsers;
  }

  blockedUsersByIds(ids: string[]): XUser[] {
    return this.blockedXUsers.filter((blockedXUser) => ids.includes(blockedXUser.id));
  }
}
