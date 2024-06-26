import { LoaderFunctionArgs } from 'react-router-dom';
import { getGroup } from './adapters/gateways/group-gateway';

export async function groupLoader({ params }: LoaderFunctionArgs) {
  return await getGroup(params.groupId as string);
}
