import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { Group, GroupDetails, UserSessionInfos, UserSessionStorage } from '@modorix/commons';
import { joinGroup, leaveGroup } from '../../adapters/gateways/group-gateway';

export async function toggleMembership(
  group: Group | GroupDetails,
  onError: (title: string, error: AuthError['error'], setUserSessionInfos: (userSessionInfos: UserSessionInfos) => void) => void,
  {
    setUserSessionInfos,
    ...userSessionStorage
  }: UserSessionStorage & { setUserSessionInfos: (userSessionInfos: UserSessionInfos) => void },
): Promise<void> {
  const gateway = group.isJoined ? leaveGroup : joinGroup;
  const result = await gateway(group.id, userSessionStorage);
  if (result) {
    const join = group.isJoined ? 'leave' : 'join';
    onError(`Couldn't ${join} ${group.name} group`, result.error, setUserSessionInfos);
  }
}
