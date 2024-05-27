import { Injectable } from '@nestjs/common';
import { XUser } from '../domain/x-user';

@Injectable()
export class BlockUserRepository {
  private readonly blockedUsers: XUser[] = [];

  blockUser(user: XUser): void {
    console.log('🚀 ~ BlockUserRepository ~ blockUser ~ user:', user);
    this.blockedUsers.push(user);
  }
}
