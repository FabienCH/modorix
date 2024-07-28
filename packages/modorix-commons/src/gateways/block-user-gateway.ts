import { XUser } from '../models/x-user';
import { getGatewayBaseUrl } from './base-url-config';

const blockedXUsersBaseUrl = () => `${getGatewayBaseUrl()}/block-x-users`;

export async function getBlockedUsers(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetch(`${blockedXUsersBaseUrl()}/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}

export async function getBlockQueue(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetch(`${blockedXUsersBaseUrl()}/queue/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}
