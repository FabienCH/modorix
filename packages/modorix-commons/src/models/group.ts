export interface Group {
  id: string;
  name: string;
  description: string;
  isJoined: boolean;
  blockedXUserIds: string[];
}
