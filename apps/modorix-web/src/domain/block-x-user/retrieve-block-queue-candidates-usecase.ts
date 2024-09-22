import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockQueueCandidates(
  getBlockQueueCandidates: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  setBlockQueueCandidates: (blockedUser: XUser[]) => void,
  userSessionStorage: UserSessionStorage,
): Promise<void> {
  const blockQueueCandidatesRes = await getBlockQueueCandidates(userSessionStorage);
  if ('error' in blockQueueCandidatesRes) {
    console.log('blockQueueCandidatesRes AUTH ERRORRR');
  } else {
    setBlockQueueCandidates(blockQueueCandidatesRes);
  }
}
