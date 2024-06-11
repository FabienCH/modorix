import { BlockReason } from '@modorix-commons/models/block-reason';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { BlockReasonsService } from '../domain/block-reason.service';

@Controller()
export class BlockReasonsController {
  constructor(private readonly blockReasonsService: BlockReasonsService) {}

  @Get('block-reasons')
  @HttpCode(200)
  blockedReasonsList(): BlockReason[] {
    return this.blockReasonsService.blockedReasonsList();
  }
}
