import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { BlockReasonsController } from '../adapters/block-reasons.controller';
import { BlockXUsersController } from '../adapters/block-x-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { ModorixUserController } from '../adapters/modorix-user.controller';
import { PublicGroupsController } from '../adapters/public-group.controller';
import { BlockReasonsRepositoryToken } from '../domain/repositories/block-reason.repository';
import { BlockXUsersRepositoryToken } from '../domain/repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../domain/repositories/groups.repository';
import { ModorixUserRepositoryToken } from '../domain/repositories/modorix-user.repository';
import { BlockReasonsService } from '../domain/usecases/block-reason.service';
import { BlockXUsersService } from '../domain/usecases/block-x-user.service';
import { GroupsService } from '../domain/usecases/group.service';
import { ModorixUserService } from '../domain/usecases/modorix-user.service';
import { SupabaseAuth } from './auth/supabase-auth';
import { SupabaseGuard } from './auth/supabase-guard';
import { SupabaseJwtStrategy } from './auth/supabase-jwt.strategy';
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
  controllers: [BlockXUsersController, GroupsController, PublicGroupsController, BlockReasonsController, ModorixUserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
    BlockXUsersService,
    GroupsService,
    BlockReasonsService,
    ModorixUserService,
    SupabaseAuth,
    SupabaseJwtStrategy,
    SupabaseGuard,
    { provide: GroupsRepositoryToken, useClass: GroupsDrizzleRepository },
    { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersDrizzleRepository },
    { provide: BlockReasonsRepositoryToken, useClass: BlockReasonsDrizzleRepository },
    { provide: ModorixUserRepositoryToken, useClass: ModorixUserSupabaseRepository },
  ],
})
export class AppModule {}
