import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { BlockReasonsService } from '../domain/usecases/block-reason.service';

@Controller()
export class BlockReasonsController {
  constructor(private readonly blockReasonsService: BlockReasonsService) {}

  @Get('block-reasons')
  @HttpCode(200)
  blockedReasonsList(): Promise<BlockReason[]> {
    return this.blockReasonsService.blockedReasonsList();
  }
}
