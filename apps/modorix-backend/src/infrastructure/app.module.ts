import { Module } from '@nestjs/common';
import { BlockUsersController } from '../adapters/block-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { BlockUsersService } from '../domain/block-user.service';
import { GroupsService } from '../domain/group.service';
import { BlockUsersRepository } from './block-user.repository';
import { GroupsRepository } from './groups.repository';

@Module({
  imports: [],
  controllers: [BlockUsersController, GroupsController],
  providers: [BlockUsersService, BlockUsersRepository, GroupsService, GroupsRepository],
})
export class AppModule {}
