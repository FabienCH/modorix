export interface XUser {
  id: string;
  blockedAt: string;
}

export function saveBlockUser(userId: string): Promise<Response> {
  return fetch('http://localhost:3000/api/block-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: userId,
      blockedAt: new Date().toISOString(),
    }),
  });
}

export async function getBlockedUsers(): Promise<XUser[]> {
  return (
    await fetch('http://localhost:3000/api/block-users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
  ).json();
}
