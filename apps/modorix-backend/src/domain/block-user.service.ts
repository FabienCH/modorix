import { XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';
import { BlockUsersRepository } from '../infrastructure/block-user.repository';

@Injectable()
export class BlockUsersService {
  constructor(private readonly blockUsersRepository: BlockUsersRepository) {}

  blockUser(user: XUser): void {
    this.blockUsersRepository.blockUser(user);
  }

  blockedUsersList(): XUser[] {
    return this.blockUsersRepository.blockedUsersList();
  }
}
