import { XUser } from './x-user';

export interface Group {
  id: string;
  name: string;
  description: string;
  isJoined: boolean;
  blockedXUserIds: string[];
}

export interface GroupDetails {
  id: string;
  name: string;
  description: string;
  isJoined: boolean;
  blockedXUsers: XUser[];
}
