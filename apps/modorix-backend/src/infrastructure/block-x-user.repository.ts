import { XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockXUsersRepository {
  private readonly blockedXUsers: XUser[];

  constructor() {
    this.blockedXUsers = [
      {
        id: '@UltraEurope',
        blockedAt: '2024-06-19T18:41:45Z',
        blockReasons: [
          { id: '0', label: 'Harassment' },
          { id: '2', label: 'Spreading fake news' },
        ],
        blockedInGroups: [
          { id: 'GE', name: 'Germany' },
          { id: 'scientists', name: 'Scientists' },
        ],
        blockingUserIds: ['2'],
      },
    ];
  }

  blockXUser(xUser: XUser): void {
    this.blockedXUsers.push(xUser);
  }

  blockedXUsersList(modorixUserId: string): XUser[] {
    return this.blockedXUsers.filter((blockedXUser) => blockedXUser.blockingUserIds.includes(modorixUserId));
  }

  blockedXUsersByIds(ids: string[]): XUser[] {
    return this.blockedXUsers.filter((blockedUser) => ids.includes(blockedUser.id));
  }

  blockQueueCandidates(modorixUserId: string) {
    return this.blockedXUsers.filter((blockedXUser) => !blockedXUser.blockingUserIds.includes(modorixUserId));
  }
}
