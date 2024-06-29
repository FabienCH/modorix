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
        blockingModorixUserIds: ['2'],
        blockQueueModorixUserIds: [],
      },
    ];
  }

  blockXUser(xUser: XUser): void {
    this.blockedXUsers.push(xUser);
  }

  updateXUser(xUser: XUser): void {
    this.blockedXUsers.forEach((currentXUser) => {
      if (currentXUser.id === xUser.id) {
        currentXUser = xUser;
      }
    });
  }

  blockedXUsersList(modorixUserId: string): XUser[] {
    return this.blockedXUsers.filter((blockedXUser) => blockedXUser.blockingModorixUserIds.includes(modorixUserId));
  }

  blockedXUsersByIds(ids: string[]): XUser[] {
    return this.blockedXUsers.filter((blockedUser) => ids.includes(blockedUser.id));
  }

  blockedXUsersById(id: string): XUser | undefined {
    return this.blockedXUsers.find((blockedUser) => blockedUser.id === id);
  }

  blockQueueCandidates(modorixUserId: string) {
    return this.blockedXUsers.filter((blockedXUser) => !blockedXUser.blockingModorixUserIds.includes(modorixUserId));
  }
}
