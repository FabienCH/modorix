import { Injectable } from '@nestjs/common';
import { XUser } from '../domain/x-user';

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
