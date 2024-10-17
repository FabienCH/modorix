import { BlockEvent } from '../domain/models/block-event';
import { XUser } from '../domain/models/x-user';

type GatewayBlockEvent = Omit<BlockEvent, 'blockedAt'> & { blockedAt: string };
export type GatewayXUser = Omit<XUser, 'blockEvents'> & { blockEvents: GatewayBlockEvent[] };
