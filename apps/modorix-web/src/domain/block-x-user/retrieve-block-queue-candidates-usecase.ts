import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockQueueCandidates(
  getBlockQueueCandidates: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  setBlockQueueCandidates: (blockedUser: XUser[]) => void,
  onError: (title: string, error: AuthError['error']) => void,
  userSessionStorage: UserSessionStorage,
): Promise<void> {
  const blockQueueCandidatesRes = await getBlockQueueCandidates(userSessionStorage);
  if ('error' in blockQueueCandidatesRes) {
    onError("Couldn't retrieve your list of block queue candidates", blockQueueCandidatesRes.error);
  } else {
    setBlockQueueCandidates(blockQueueCandidatesRes);
  }
}
