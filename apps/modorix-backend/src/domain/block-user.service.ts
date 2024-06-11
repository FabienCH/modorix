import { XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';
import { BlockUsersRepository } from '../infrastructure/block-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';

@Injectable()
export class BlockUsersService {
  constructor(
    private readonly blockUsersRepository: BlockUsersRepository,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  blockUser(user: XUser): void {
    this.blockUsersRepository.blockUser(user);
    const groups = this.groupsRepository.groupsList();
    groups.forEach((group) => {
      this.groupsRepository.addBlockedUser(group.id, user.id);
    });
  }

  blockedUsersList(): XUser[] {
    return this.blockUsersRepository.blockedUsersList();
  }
}
