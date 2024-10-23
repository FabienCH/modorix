import { XUser } from './x-user';

interface BaseGroup {
  id: string;
  name: string;
  description: string;
  isJoined: boolean;
}

export interface Group extends BaseGroup {
  blockedXUserIds: string[];
}

export interface GroupDetails extends BaseGroup {
  membersCount: number;
  blockedXUsers: XUser[];
}
