export interface XUser {
  id: string;
  blockedAt: string;
}

export async function getBlockedUsers(): Promise<XUser[]> {
  return (
    await fetch('http://localhost:3000/api/block-users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
  ).json();
}
