import { GroupDetails } from '@modorix/commons';
import { LoaderFunctionArgs } from 'react-router-dom';
import { getGroup } from './adapters/gateways/group-gateway';
import { dependencies } from './infrastructure/dependencies';

export async function groupLoader({ params }: LoaderFunctionArgs): Promise<GroupDetails> {
  return await getGroup(params.groupId as string, dependencies.userSessionStorage.getItem);
}
