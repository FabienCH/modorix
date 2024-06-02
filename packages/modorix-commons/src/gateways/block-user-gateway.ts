import { XUser } from '../models/x-user';

export async function getBlockedUsers(): Promise<XUser[]> {
  return (
    await fetch('http://localhost:3000/api/block-users', {
      method: 'GET',
    })
  ).json();
}
