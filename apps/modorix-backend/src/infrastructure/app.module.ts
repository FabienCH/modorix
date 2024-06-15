import { Module } from '@nestjs/common';
import { BlockReasonsController } from 'src/adapters/block-reasons.controller';
import { BlockReasonsService } from 'src/domain/block-reason.service';
import { BlockUsersController } from '../adapters/block-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { BlockUsersService } from '../domain/block-user.service';
import { GroupsService } from '../domain/group.service';
import { BlockReasonsRepository } from './block-reason.repository';
import { BlockUsersRepository } from './block-user.repository';
import { GroupsRepository } from './groups.repository';

@Module({
  imports: [],
  controllers: [BlockUsersController, GroupsController, BlockReasonsController],
  providers: [BlockUsersService, BlockUsersRepository, GroupsService, GroupsRepository, BlockReasonsService, BlockReasonsRepository],
})
export class AppModule {}
