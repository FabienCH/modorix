import { UserSession, UserSessionStorage } from '@modorix/commons';
import { retrieveBlockReasonsList } from './retrieve-block-reasons-usecase';

describe('Retrieve block reasons', () => {
  const userSessionStorage: UserSessionStorage = {
    getAccessToken: () => null,
    getRefreshToken: () => null,
    saveUserSession: (_: UserSession | null) => null,
    getUserInfos: () => ({
      hasValidAccessToken: false,
      userEmail: null,
    }),
  };

  it('should give a list of block reasons', async () => {
    const blockReasons = [{ id: 'id', label: 'Block reason label' }];

    const retrieveBlockedUsersListResult = await retrieveBlockReasonsList(async () => blockReasons, userSessionStorage);

    expect(retrieveBlockedUsersListResult).toEqual({ blockReasons, errorMessage: null });
  });

  it('should give an error message if user is not authenticated', async () => {
    const retrieveBlockedUsersListResult = await retrieveBlockReasonsList(async () => ({ error: 'auth' }), userSessionStorage);

    expect(retrieveBlockedUsersListResult).toEqual({
      blockReasons: [],
      errorMessage: "Couldn't load block reasons. You are not logged in the Modorix extension. Please log in and try again.",
    });
  });

  it('should give an error message if there is an other error', async () => {
    const retrieveBlockedUsersListResult = await retrieveBlockReasonsList(async () => ({ error: 'other' }), userSessionStorage);

    expect(retrieveBlockedUsersListResult).toEqual({
      blockReasons: [],
      errorMessage: "Couldn't load block reasons. Something went wrong, please try again.",
    });
  });
});
