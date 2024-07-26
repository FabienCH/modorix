import { BlockReason } from '@modorix-commons/models/block-reason';
import { Inject, Injectable } from '@nestjs/common';
import { BlockReasonsRepository, BlockReasonsRepositoryToken } from '../repositories/block-reason.repository';

@Injectable()
export class BlockReasonsService {
  constructor(@Inject(BlockReasonsRepositoryToken) private readonly blockReasonsRepository: BlockReasonsRepository) {}

  blockedReasonsList(): BlockReason[] {
    return this.blockReasonsRepository.blockedReasonsList();
  }
}
