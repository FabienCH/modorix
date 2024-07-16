import { XUser } from './x-user';

interface BaseGroup {
  id: string;
  name: string;
  description: string;
  isJoined: boolean;
}

export interface Group extends BaseGroup {
  blockedXUserIds: number[];
}

export interface GroupDetails extends BaseGroup {
  blockedXUsers: XUser[];
}
