import { mapToXUserData } from '../adapters/to-x-user-data';
import { XUser } from '../domain/models/x-user';

export interface XUserRowConfig {
  index: number;
  getCellElem: (xUser: XUser) => JSX.Element;
}

interface XUsersRowProps {
  BadgesComponent: (props: { items: { id: string; label: string }[]; badgeVariant: 'outline' | 'secondary' }) => JSX.Element;
  blockedUsers: XUser[];
  additionalRows: Array<XUserRowConfig> | undefined;
}

export type XUserRow =
  | [string, string, JSX.Element]
  | [string, JSX.Element, string, JSX.Element]
  | [string, JSX.Element, string, JSX.Element, JSX.Element];

export type XUsersData = XUserRow[];

export const mapToXUsersData = ({ BadgesComponent, blockedUsers, additionalRows }: XUsersRowProps): XUsersData => {
  return blockedUsers.map((user) => {
    const xUserData = mapToXUserData(user);
    const xUserRow: XUserRow = [
      xUserData.xUsername,
      xUserData.firstBlockedAt,
      <BadgesComponent items={xUserData.blockReasons} badgeVariant="secondary"></BadgesComponent>,
    ];
    additionalRows?.forEach((row) => {
      xUserRow.splice(row.index, 0, row.getCellElem(user));
    });

    return xUserRow;
  });
};
