import { BlockReason } from '@modorix-commons/models/block-reason';
import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlockXUserRequestDto implements BlockXUserRequest {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsDateString()
  blockedAt!: string;

  @IsArray()
  @IsString({ each: true })
  blockReasonIds!: string[];

  @IsNotEmpty()
  @IsString()
  blockingUserId!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  blockedInGroupsIds?: string[];
}

export class XUserDto implements XUser {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsDateString()
  blockedAt!: string;

  @IsArray()
  blockReasons!: BlockReason[];

  @IsArray()
  @IsString({ each: true })
  blockingUserIds!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  blockedInGroups?: { id: string; name: string }[];
}
