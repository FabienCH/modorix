import { MockInstance } from 'vitest';
import { UserSession } from '../domain/login/models/user-session';
import { UserSessionStorage } from '../domain/login/storage/user-session-storage';
import { fetchWithAuth } from './fetch-with-auth';
import * as HttpUserGateway from './http-user-gateway';

describe('Fetch with auth', () => {
  let expectedInputs: Array<string | URL | globalThis.Request>;
  let expectedInits: Array<RequestInit | undefined>;
  let savedUserSession: Partial<UserSession> | undefined;
  let refreshAccessTokenSpy: MockInstance;
  let realFetch: typeof global.fetch;

  const validUserSession = { accessToken: 'access-token', refreshToken: 'refresh-token', email: 'john.doe@test.com' };
  const userSessionStorage: UserSessionStorage = {
    getAccessToken: () => savedUserSession?.accessToken ?? '',
    getRefreshToken: () => savedUserSession?.refreshToken ?? '',
    saveUserSession: (userSession: UserSession) => {
      savedUserSession = userSession;
    },
    getUserInfos: () => ({
      hasValidAccessToken: !savedUserSession?.accessToken,
      userEmail: savedUserSession?.email ?? null,
    }),
  };

  beforeAll(() => {
    realFetch = global.fetch;
    global.fetch = async (input: string | URL | globalThis.Request, init?: RequestInit) => {
      expectedInputs.push(input);
      expectedInits.push(init);
      const response =
        !!savedUserSession?.accessToken && savedUserSession.accessToken !== 'invalid'
          ? Response.json({})
          : Response.json({}, { status: 401 });

      return response;
    };
  });

  beforeEach(() => {
    refreshAccessTokenSpy = vi.spyOn(HttpUserGateway, 'refreshAccessToken');
    expectedInputs = [];
    expectedInits = [];
    savedUserSession = undefined;
  });

  afterAll(() => {
    global.fetch = realFetch;
  });

  it('should execute request with user authentication', async () => {
    savedUserSession = validUserSession;
    await fetchWithAuth('/endpoint-path', { method: 'GET' }, userSessionStorage);

    expect(expectedInputs).toEqual(['/endpoint-path']);
    expect(expectedInits).toEqual([{ method: 'GET', headers: { Authorization: 'Bearer access-token' } }]);
  });

  it('should refresh access token and execute request with user authentication if token is invalid', async () => {
    savedUserSession = { accessToken: 'invalid', refreshToken: 'refresh-token', email: 'john.doe@test.com' };
    refreshAccessTokenSpy.mockReturnValue(await validUserSession);

    await fetchWithAuth('/endpoint-path', { method: 'GET' }, userSessionStorage);

    expect(expectedInputs).toEqual(['/endpoint-path', '/endpoint-path']);
    expect(expectedInits).toEqual([
      { method: 'GET', headers: { Authorization: 'Bearer invalid' } },
      { method: 'GET', headers: { Authorization: 'Bearer access-token' } },
    ]);
  });

  it('should fail to execute request and not retry if access token and refresh token are invalid', async () => {
    savedUserSession = { accessToken: 'invalid', refreshToken: 'invalid', email: 'john.doe@test.com' };
    refreshAccessTokenSpy.mockReturnValue(await null);

    await fetchWithAuth('/endpoint-path', { method: 'GET' }, userSessionStorage);

    expect(expectedInputs).toEqual(['/endpoint-path']);
    expect(expectedInits).toEqual([{ method: 'GET', headers: { Authorization: 'Bearer invalid' } }]);
  });

  it('should not execute request if user session is empty', async () => {
    refreshAccessTokenSpy.mockReturnValue(await null);

    await fetchWithAuth('/endpoint-path', { method: 'GET' }, userSessionStorage);

    expect(expectedInputs).toEqual([]);
    expect(expectedInits).toEqual([]);
  });
});