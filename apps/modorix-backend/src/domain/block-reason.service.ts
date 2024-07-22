import { BlockReason } from '@modorix-commons/models/block-reason';
import { Injectable } from '@nestjs/common';
import { BlockReasonsRepository } from '../infrastructure/repositories/block-reason.repository';

@Injectable()
export class BlockReasonsService {
  constructor(private readonly blockReasonsRepository: BlockReasonsRepository) {}

  blockedReasonsList(): BlockReason[] {
    return this.blockReasonsRepository.blockedReasonsList();
  }
}
