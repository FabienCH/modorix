import { XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockUsersRepository {
  private readonly blockedUsers: XUser[] = [];

  blockUser(user: XUser): void {
    this.blockedUsers.push(user);
  }

  blockedUsersList(): XUser[] {
    return this.blockedUsers;
  }
}
