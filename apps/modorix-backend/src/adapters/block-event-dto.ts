import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

interface IBlockEvent extends Omit<BlockEvent, 'blockedAt'> {
  blockedAt: string;
}

export class BlockEventDto implements IBlockEvent {
  @IsNotEmpty()
  @IsString()
  modorixUserId!: string;

  @IsNotEmpty()
  @IsDateString()
  blockedAt!: string;

  @IsArray()
  blockReasons!: BlockReason[];

  @IsArray()
  blockedInGroups!: { id: string; name: string }[];
}
