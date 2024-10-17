import { GroupDetails } from '@modorix/commons';
import { LoaderFunctionArgs } from 'react-router-dom';
import { getGroup } from './adapters/gateways/group-gateway';
import { getAccessTokenFromCookies } from './adapters/storage/cookies-user-session-storage';

export async function groupLoader({ params }: LoaderFunctionArgs): Promise<GroupDetails> {
  return await getGroup(params.groupId as string, getAccessTokenFromCookies);
}
