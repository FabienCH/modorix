import { Group } from '@modorix-commons/models/group';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupsRepository {
  private groupNotFound = true;
  private readonly groups: Group[] = [
    { id: 'US', name: 'United States', description: 'For people living in US', isJoined: false },
    { id: 'UK', name: 'United Kingdom', description: 'For people living in Uk', isJoined: false },
    { id: 'GE', name: 'Germany', description: 'For people living in Germany', isJoined: false },
    { id: 'FR', name: 'France', description: 'For people living in France', isJoined: false },
    { id: 'ES', name: 'Spain', description: 'For people living in Spain', isJoined: false },
    { id: 'scientists', name: 'Scientists', description: 'For scientists or people working around science', isJoined: false },
    { id: 'streamers', name: 'Streamers', description: 'For streamers or people working around streaming', isJoined: false },
    { id: 'influencers', name: 'Influencers', description: 'For influencers or people working around influencers', isJoined: false },
    { id: 'journalists', name: 'Journalists', description: 'For journalists or people working around journalism', isJoined: false },
    { id: 'artists', name: 'Artists', description: 'For artists or people working around arts', isJoined: false },
    { id: 'sports(wo)men', name: 'Sports(wo)men', description: 'For sports(wo)men or people working around sports', isJoined: false },
  ];

  updateIsJoined(groupId: string, isJoined: boolean): void | null {
    this.groupNotFound = true;
    this.groups.forEach((group) => {
      if (group.id === groupId) {
        this.groupNotFound = false;
        group.isJoined = isJoined;
      }
    });

    if (this.groupNotFound) {
      return null;
    }
  }

  groupsList(): Group[] {
    return this.groups;
  }
}
