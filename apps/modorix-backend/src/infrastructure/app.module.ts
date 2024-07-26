import { Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BlockReasonsController } from 'src/adapters/block-reasons.controller';
import { BlockReasonsService } from 'src/domain/block-reason.service';
import { BlockXUsersController } from '../adapters/block-x-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { BlockXUsersService } from '../domain/block-x-user.service';
import { GroupsService } from '../domain/group.service';
import { DrizzleModule, PG_CONNECTION } from './database/drizzle.module';
import { pgXUsers } from './database/schema/xUser';
import { BlockReasonsRepository } from './repositories/block-reason.repository';
import { BlockXUsersRepository } from './repositories/block-x-user.repository';
import { GroupsRepository } from './repositories/groups.repository';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `${ENV}.env`,
    }),
  ],
  controllers: [BlockXUsersController, GroupsController, BlockReasonsController],
  providers: [BlockXUsersService, BlockXUsersRepository, GroupsService, GroupsRepository, BlockReasonsService, BlockReasonsRepository],
})
export class AppModule {
  constructor(
    @Inject(PG_CONNECTION) private pgConnection: NodePgDatabase,
    private readonly blockXUserRepository: BlockXUsersRepository,
  ) {
    this.blockXUserRepository.blockXUser({
      xId: '862285194',
      xUsername: '@UltraEurope',
      blockedAt: '2024-06-19T18:41:45Z',
      blockReasons: [
        { id: '0', label: 'Harassment' },
        { id: '2', label: 'Spreading fake news' },
      ],
      blockedInGroups: [
        { id: 'GE', name: 'Germany' },
        { id: 'scientists', name: 'Scientists' },
      ],
      blockingModorixUserIds: ['2'],
      blockQueueModorixUserIds: [],
    });
    this.blockXUserRepository.blockXUser({
      xId: '41147159',
      xUsername: 'nikefootball',
      blockedAt: '2024-07-09T10:00:51.889Z',
      blockReasons: [{ id: '7', label: 'Other' }],
      blockingModorixUserIds: ['2'],
      blockedInGroups: [{ id: 'scientists', name: 'Scientists' }],
      blockQueueModorixUserIds: [],
    });
    this.blockXUserRepository.blockXUser({
      xId: '1517027978248527872',
      xUsername: 'OnceHuman_',
      blockedAt: '2024-07-10T15:49:54.380Z',
      blockReasons: [
        { id: '3', label: 'Homophobia / Transphobia' },
        {
          id: '4',
          label: 'Incitement to hatred, violence or discrimination',
        },
        { id: '7', label: 'Other' },
      ],
      blockingModorixUserIds: ['2'],
      blockedInGroups: [{ id: 'FR', name: 'France' }],
      blockQueueModorixUserIds: [],
    });

    this.testDb();
  }

  private async testDb() {
    console.log('pgConnection', await this.pgConnection.select().from(pgXUsers));
  }
}
