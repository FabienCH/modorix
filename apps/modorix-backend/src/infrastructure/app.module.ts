import { Module } from '@nestjs/common';
import { BlockUserController } from '../adapters/block-user.controller';
import { BlockUserService } from '../domain/block-user.service';
import { BlockUserRepository } from './block-user.repository';

@Module({
  imports: [],
  controllers: [BlockUserController],
  providers: [BlockUserService, BlockUserRepository],
})
export class AppModule {}
