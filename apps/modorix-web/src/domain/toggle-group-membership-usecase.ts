import { Group } from '@modorix-commons/models/group';
import { joinGroup, leaveGroup } from '../adapters/gateways/group-gateway';

export async function toggleMemberShip(group: Group): Promise<void> {
  if (group.isJoined) {
    await leaveGroup(group.id);
  } else {
    await joinGroup(group.id);
  }
}
