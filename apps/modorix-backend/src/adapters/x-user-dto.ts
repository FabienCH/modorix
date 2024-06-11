import { XUser } from '@modorix-commons/models/x-user';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class XUserDto implements XUser {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsDateString()
  blockedAt!: string;

  @IsArray()
  @IsString({ each: true })
  blockReasonIds!: string[];
}
