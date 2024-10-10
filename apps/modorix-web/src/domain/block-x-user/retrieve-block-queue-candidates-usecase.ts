import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionInfos, UserSessionStorage, XUser } from '@modorix/commons';
import { OnErrorCallback } from '../model/on-error-callback';

export async function retrieveBlockQueueCandidates(
  getBlockQueueCandidates: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  setBlockQueueCandidates: (blockedUser: XUser[]) => void,
  onError: OnErrorCallback,
  {
    setUserSessionInfos,
    ...userSessionStorage
  }: UserSessionStorage & { setUserSessionInfos: (userSessionInfos: UserSessionInfos | null) => void },
): Promise<void> {
  const blockQueueCandidatesRes = await getBlockQueueCandidates(userSessionStorage);
  if ('error' in blockQueueCandidatesRes) {
    onError("Couldn't retrieve your list of block queue candidates", blockQueueCandidatesRes.error, setUserSessionInfos);
    setBlockQueueCandidates([]);
  } else {
    setBlockQueueCandidates(blockQueueCandidatesRes);
  }
}
