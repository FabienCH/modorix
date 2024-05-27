import { Injectable } from '@nestjs/common';
import { BlockUserRepository } from '../infrastructure/block-user.repository';
import { XUser } from './x-user';

@Injectable()
export class BlockUserService {
  constructor(private readonly blockUserRepository: BlockUserRepository) {}

  blockUser(user: XUser): void {
    this.blockUserRepository.blockUser(user);
  }
}
