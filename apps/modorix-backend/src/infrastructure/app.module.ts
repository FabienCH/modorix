import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockReasonsController } from 'src/adapters/block-reasons.controller';

import { BlockXUsersController } from '../adapters/block-x-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { BlockReasonsRepositoryToken } from '../domain/repositories/block-reason.repository';
import { BlockXUsersRepositoryToken } from '../domain/repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../domain/repositories/groups.repository';
import { BlockReasonsService } from '../domain/usecases/block-reason.service';
import { BlockXUsersService } from '../domain/usecases/block-x-user.service';
import { GroupsService } from '../domain/usecases/group.service';
import { DrizzleModule } from './database/drizzle.module';
import { BlockReasonsDrizzleRepository } from './repositories/drizzle/block-reason-drizzle.repository';
import { BlockXUsersDrizzleRepository } from './repositories/drizzle/block-x-user-drizzle.repository';
import { GroupsDrizzleRepository } from './repositories/drizzle/groups-drizzle.repository';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `${ENV}.env`,
    }),
  ],
  controllers: [BlockXUsersController, GroupsController, BlockReasonsController],
  providers: [
    BlockXUsersService,
    GroupsService,
    BlockReasonsService,
    { provide: GroupsRepositoryToken, useClass: GroupsDrizzleRepository },
    { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersDrizzleRepository },
    { provide: BlockReasonsRepositoryToken, useClass: BlockReasonsDrizzleRepository },
  ],
})
export class AppModule {}
