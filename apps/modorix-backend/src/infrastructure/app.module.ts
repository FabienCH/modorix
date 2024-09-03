import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockReasonsController } from 'src/adapters/block-reasons.controller';

import { ModorixUserController } from 'src/adapters/modorix-user.controller';
import { ModorixUserRepositoryToken } from 'src/domain/repositories/modorix-user.repository';
import { ModorixXUserService } from 'src/domain/usecases/modorix-user.service';
import { BlockXUsersController } from '../adapters/block-x-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { BlockReasonsRepositoryToken } from '../domain/repositories/block-reason.repository';
import { BlockXUsersRepositoryToken } from '../domain/repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../domain/repositories/groups.repository';
import { BlockReasonsService } from '../domain/usecases/block-reason.service';
import { BlockXUsersService } from '../domain/usecases/block-x-user.service';
import { GroupsService } from '../domain/usecases/group.service';
import { SupabaseAuth } from './auth/supabase-auth';
import { DrizzleModule } from './database/drizzle.module';
import { BlockReasonsDrizzleRepository } from './repositories/drizzle/block-reason-drizzle.repository';
import { BlockXUsersDrizzleRepository } from './repositories/drizzle/block-x-user-drizzle.repository';
import { GroupsDrizzleRepository } from './repositories/drizzle/groups-drizzle.repository';
import { ModorixUserSupabaseRepository } from './repositories/supabase/modorix-user-supabase.repository';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `${ENV}.env`,
    }),
  ],
  controllers: [BlockXUsersController, GroupsController, BlockReasonsController, ModorixUserController],
  providers: [
    BlockXUsersService,
    GroupsService,
    BlockReasonsService,
    ModorixXUserService,
    SupabaseAuth,
    { provide: GroupsRepositoryToken, useClass: GroupsDrizzleRepository },
    { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersDrizzleRepository },
    { provide: BlockReasonsRepositoryToken, useClass: BlockReasonsDrizzleRepository },
    { provide: ModorixUserRepositoryToken, useClass: ModorixUserSupabaseRepository },
  ],
})
export class AppModule {}
