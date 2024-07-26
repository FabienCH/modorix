import { Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BlockReasonsController } from 'src/adapters/block-reasons.controller';
import { BlockReasonsRepositoryToken } from '../../domain/repositories/block-reason.repository';
import { BlockXUsersRepositoryToken } from '../../domain/repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../../domain/repositories/groups.repository';
import { BlockReasonsService } from '../../domain/usecases/block-reason.service';
import { BlockXUsersController } from '../adapters/block-x-user.controller';
import { GroupsController } from '../adapters/group.controller';
import { BlockXUsersService } from '../domain/usecases/block-x-user.service';
import { GroupsService } from '../domain/usecases/group.service';
import { DrizzleModule, PG_CONNECTION } from './database/drizzle.module';
import { pgXUsers } from './database/schema/xUser';
import { BlockReasonsInMemoryRepository } from './repositories/block-reason-in-memory.repository';
import { BlockXUsersInMemoryRepository } from './repositories/block-x-user-in-memory.repository';
import { GroupsInMemoryRepository } from './repositories/groups-in-memory.repository';

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
    { provide: GroupsRepositoryToken, useClass: GroupsInMemoryRepository },
    { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersInMemoryRepository },
    { provide: BlockReasonsRepositoryToken, useClass: BlockReasonsInMemoryRepository },
  ],
})
export class AppModule {
  constructor(
    @Inject(PG_CONNECTION) private pgConnection: NodePgDatabase,
    private readonly blockXUserRepository: BlockXUsersInMemoryRepository,
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
