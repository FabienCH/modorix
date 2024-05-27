import { IsString, IsNotEmpty, IsDateString } from "class-validator"
import { XUser } from "src/domain/x-user"

export class XUserDto implements XUser {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsDateString()
  blockedAt: string
}