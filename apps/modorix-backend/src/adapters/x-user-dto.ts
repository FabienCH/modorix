import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { BlockXUserRequest, XUser } from '@modorix-commons/domain/models/x-user';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BlockEventDto } from './block-event-dto';

export class BlockXUserRequestDto implements BlockXUserRequest {
  @IsNotEmpty()
  @IsString()
  xId!: string;

  @IsNotEmpty()
  @IsString()
  xUsername!: string;

  @IsNotEmpty()
  @IsDateString()
  blockedAt!: string;

  @IsArray()
  @IsString({ each: true })
  blockReasonIds!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  blockedInGroupsIds?: string[];
}

export class XUserDto implements XUser {
  @IsNotEmpty()
  @IsString()
  xId!: string;

  @IsNotEmpty()
  @IsString()
  xUsername!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockEventDto)
  blockEvents!: BlockEvent[];

  @IsArray()
  blockQueueModorixUserIds!: string[];
}
