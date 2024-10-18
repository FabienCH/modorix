import { GroupDetails } from '../domain/models/group';
import { GatewayXUser } from './gateway-x-user';

export type GatewayGroupDetails = Omit<GroupDetails, 'blockedXUsers'> & { blockedXUsers: GatewayXUser[] };
