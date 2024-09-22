import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { BlockReason, UserSessionStorage } from '@modorix/commons';

export async function retrieveBlockedUsersList(
  getBlockReasons: (userSessionStorage: UserSessionStorage) => Promise<BlockReason[] | AuthError>,
  userSessionStorage: UserSessionStorage,
): Promise<{ blockReasons: BlockReason[]; errorMessage: string | null }> {
  const blockReasons = await getBlockReasons(userSessionStorage);
  if ('error' in blockReasons) {
    const messageDetails =
      blockReasons.error === 'auth'
        ? 'You are not logged in the Modorix extension. Please log in and try again.'
        : 'Something went wrong, please try again.';
    return { blockReasons: [], errorMessage: `Couldn't load block reasons. ${messageDetails}` };
  }
  return { blockReasons, errorMessage: null };
}
