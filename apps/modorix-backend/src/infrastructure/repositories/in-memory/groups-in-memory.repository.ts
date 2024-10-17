import { Group } from '@modorix-commons/domain/models/group';
import { Injectable } from '@nestjs/common';
import { GroupsRepository } from '../../../domain/repositories/groups.repository';

type InMemoryGroup = Omit<Group, 'isJoined'> & { isJoinedBy: string[] };

@Injectable()
export class GroupsInMemoryRepository implements GroupsRepository {
  private groupNotFound = true;
  private readonly groups: InMemoryGroup[] = [
    { id: 'US', name: 'United States', description: 'For people living in US', blockedXUserIds: [], isJoinedBy: [] },
    { id: 'UK', name: 'United Kingdom', description: 'For people living in Uk', blockedXUserIds: [], isJoinedBy: [] },
    {
      id: 'GE',
      name: 'Germany',
      description: 'For people living in Germany',

      blockedXUserIds: [],
      isJoinedBy: [],
    },
    { id: 'FR', name: 'France', description: 'For people living in France', blockedXUserIds: [], isJoinedBy: [] },
    { id: 'ES', name: 'Spain', description: 'For people living in Spain', blockedXUserIds: [], isJoinedBy: [] },
    {
      id: 'scientists',
      name: 'Scientists',
      description: 'For scientists or people working around science',

      blockedXUserIds: [],
      isJoinedBy: [],
    },
    {
      id: 'streamers',
      name: 'Streamers',
      description: 'For streamers or people working around streaming',

      blockedXUserIds: [],
      isJoinedBy: [],
    },
    {
      id: 'influencers',
      name: 'Influencers',
      description: 'For influencers or people working around influencers',

      blockedXUserIds: [],
      isJoinedBy: [],
    },
    {
      id: 'journalists',
      name: 'Journalists',
      description: 'For journalists or people working around journalism',

      blockedXUserIds: [],
      isJoinedBy: [],
    },
    {
      id: 'artists',
      name: 'Artists',
      description: 'For artists or people working around arts',

      blockedXUserIds: [],
      isJoinedBy: [],
    },
    {
      id: 'sports(wo)men',
      name: 'Sports(wo)men',
      description: 'For sports(wo)men or people working around sports',

      blockedXUserIds: [],
      isJoinedBy: [],
    },
  ];

  async groupsList(modorixUserId: string | undefined): Promise<Group[]> {
    return this.groups.map((group) => this.toGroup(group, modorixUserId));
  }

  async groupsByIds(ids: string[], modorixUserId: string): Promise<Group[]> {
    return this.groups.filter((group) => ids.includes(group.id)).map((group) => this.toGroup(group, modorixUserId));
  }

  async findGroupById(groupId: string, modorixUserId: string | undefined): Promise<Group | null> {
    const group = this.groups.find((group) => group.id === groupId);
    if (group) {
      return this.toGroup(group, modorixUserId);
    }
    return null;
  }

  async joinGroup(groupId: string, modorixUserId: string): Promise<void | null> {
    this.groupNotFound = true;
    this.groups.forEach((group) => {
      if (group.id === groupId) {
        this.groupNotFound = false;
        group.isJoinedBy.push(modorixUserId);
      }
    });

    if (this.groupNotFound) {
      return null;
    }
  }

  async leaveGroup(groupId: string, modorixUserId: string): Promise<void | null> {
    this.groupNotFound = true;
    this.groups.forEach((group) => {
      if (group.id === groupId) {
        this.groupNotFound = false;
        group.isJoinedBy = group.isJoinedBy.filter((id) => id !== modorixUserId);
      }
    });

    if (this.groupNotFound) {
      return null;
    }
  }

  addBlockedUser(groupId: string, blockedUserId: string): void {
    this.groups.forEach((group) => {
      if (group.id === groupId) {
        group.blockedXUserIds.push(blockedUserId);
      }
    });
  }

  private toGroup(inMemoryGroup: InMemoryGroup, modorixUserId: string | undefined): Group {
    return {
      id: inMemoryGroup.id,
      name: inMemoryGroup.name,
      description: inMemoryGroup.description,
      isJoined: !!inMemoryGroup.isJoinedBy.find((id) => id === modorixUserId),
      blockedXUserIds: inMemoryGroup.blockedXUserIds,
    };
  }
}
