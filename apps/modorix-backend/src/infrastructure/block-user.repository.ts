import { Injectable } from '@nestjs/common';
import { XUser } from '../domain/x-user';

@Injectable()
export class BlockUserRepository {

  private readonly blockedUsers: XUser[] = []

  blockUser(user: XUser): void {
    this.blockedUsers.push(user)
  }
}
