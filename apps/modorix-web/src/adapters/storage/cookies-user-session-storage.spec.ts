import Cookies from 'js-cookie';
import { getUserInfosFromCookies } from './cookies-user-session-storage';

describe('Get user infos from cookies storage', () => {
  beforeAll(() => {
    const ts_20241609_101710_GMT = 1726481830000;
    const date = new Date(ts_20241609_101710_GMT);
    vi.setSystemTime(date);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should have a valid token', async () => {
    const validTokenUntil_20241609_112110_GMT =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTcyNjQ3ODQ3MCwiZXhwIjoxNzI2NDg1NjcwfQ.-drxw7jMzuOs732hbZ8wMYWzIYNSKKgCTBZBTlWI06o';
    mockChromeLocalStorage(validTokenUntil_20241609_112110_GMT);

    const userSessionInfos = await getUserInfosFromCookies();

    expect(userSessionInfos).toEqual({ hasValidAccessToken: true, userEmail: 'john.doe@test.com' });
  });

  it('should not have a valid token if expired', async () => {
    const expiredTokenAt_20241609_091410_GMT =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzI2NDcwODUwLCJleHAiOjE3MjY0NzgwNTB9.YI2VYmHz7Uj2_SgcKb5pskj848MH4eZvvL4ImtvIrmc';
    mockChromeLocalStorage(expiredTokenAt_20241609_091410_GMT);

    const userSessionInfos = await getUserInfosFromCookies();

    expect(userSessionInfos).toEqual({ hasValidAccessToken: false, userEmail: 'john.doe@test.com' });
  });
});

function mockChromeLocalStorage(accessToken: string) {
  // @ts-expect-error: TS2345
  vi.spyOn(Cookies, 'get').mockImplementation((key: string): string | undefined => {
    if (key === 'access-token') {
      return accessToken;
    }
    if (key === 'user-email') {
      return 'john.doe@test.com';
    }
    return undefined;
  });
}
