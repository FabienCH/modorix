import { XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockUsersRepository {
  private readonly blockedUsers: XUser[] = [];

  blockUser(xUser: XUser): void {
    this.blockedUsers.push(xUser);
  }

  blockedUsersList(): XUser[] {
    return this.blockedUsers;
  }

  blockedUsersByIds(ids: string[]): XUser[] {
    return this.blockedUsers.filter((blockedUser) => ids.includes(blockedUser.id));
  }
}
