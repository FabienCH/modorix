import { Group, GroupDetails } from '@modorix/commons';
import { joinGroup, leaveGroup } from '../../adapters/gateways/group-gateway';

export async function toggleMembership(group: Group | GroupDetails): Promise<void> {
  if (group.isJoined) {
    await leaveGroup(group.id);
  } else {
    await joinGroup(group.id);
  }
}
