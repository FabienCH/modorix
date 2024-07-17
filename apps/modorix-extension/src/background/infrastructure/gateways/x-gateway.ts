const xApiV1Url = 'https://x.com/i/api/1.1';

export async function blockUserOnX(xUserId: string, xHeaders: Record<string, string>): Promise<Response> {
  const body = `user_id=${xUserId}`;
  const headers: { [k: string]: string } = {
    'content-length': body.length.toString(),
    'content-type': 'application/x-www-form-urlencoded',
    ...xHeaders,
  };
  const credentials: RequestCredentials = 'include';
  const options = { body, headers, method: 'POST', credentials };

  return fetch(`${xApiV1Url}/blocks/create.json`, options);
}
