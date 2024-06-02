import { Module } from '@nestjs/common';
import { BlockUsersController } from '../adapters/block-user.controller';
import { BlockUsersService } from '../domain/block-user.service';
import { BlockUsersRepository } from './block-user.repository';

@Module({
  imports: [],
  controllers: [BlockUsersController],
  providers: [BlockUsersService, BlockUsersRepository],
})
export class AppModule {}
