import { Group, GroupDetails, UserSessionStorage } from '@modorix/commons';
import { joinGroup, leaveGroup } from '../../adapters/gateways/group-gateway';

export async function toggleMembership(group: Group | GroupDetails, userSessionStorage: UserSessionStorage): Promise<void> {
  if (group.isJoined) {
    await leaveGroup(group.id, userSessionStorage);
  } else {
    await joinGroup(group.id, userSessionStorage);
  }
}
