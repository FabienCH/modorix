import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BlockEventDto implements BlockEvent {
  @IsNotEmpty()
  @IsString()
  modorixUserId!: string;

  @IsNotEmpty()
  @IsString()
  blockedAt!: string;

  @IsArray()
  blockReasons!: BlockReason[];

  @IsArray()
  blockedInGroups!: { id: string; name: string }[];
}
