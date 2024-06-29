import { Module } from '@nestjs/common';
import { BlockReasonsController } from 'src/adapters/block-reasons.controller';
import { BlockReasonsService } from 'src/domain/block-reason.service';
import { BlockXUsersController } from '../adapters/block-x-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { BlockXUsersService } from '../domain/block-x-user.service';
import { GroupsService } from '../domain/group.service';
import { BlockReasonsRepository } from './block-reason.repository';
import { BlockXUsersRepository } from './block-x-user.repository';
import { GroupsRepository } from './groups.repository';

@Module({
  imports: [],
  controllers: [BlockXUsersController, GroupsController, BlockReasonsController],
  providers: [BlockXUsersService, BlockXUsersRepository, GroupsService, GroupsRepository, BlockReasonsService, BlockReasonsRepository],
})
export class AppModule {}
