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
    const xUsersData: XUserRow = [
      user.xUsername,
      new Date(user.blockEvents[0].blockedAt).toLocaleDateString(),
      <BadgesComponent items={user.blockEvents[0].blockReasons} badgeVariant="secondary"></BadgesComponent>,
    ];
    additionalRows?.forEach((row) => {
      xUsersData.splice(row.index, 0, row.getCellElem(user));
    });

    return xUsersData;
  });
};
