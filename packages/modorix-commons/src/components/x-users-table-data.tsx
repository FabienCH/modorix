import { XUser } from '../models/x-user';

interface XUsersRowProps {
  BadgesComponent: (props: { items: { id: string; label: string }[]; badgeVariant: 'outline' | 'secondary' }) => JSX.Element;
  blockedUsers: XUser[];
  optionalCol: 'groups' | undefined;
}

export type XUserRow =
  | [string, string, JSX.Element]
  | [string, JSX.Element, string, JSX.Element]
  | [string, JSX.Element, string, JSX.Element, JSX.Element];

export type XUsersData = XUserRow[];

export const mapToXUsersData = ({ BadgesComponent, blockedUsers, optionalCol }: XUsersRowProps): XUsersData => {
  return blockedUsers.map((user) => {
    const defaultRow: XUserRow = [
      user.id,
      new Date(user.blockedAt).toLocaleDateString(),
      <BadgesComponent items={user.blockReasons} badgeVariant="secondary"></BadgesComponent>,
    ];
    if (optionalCol === 'groups') {
      defaultRow.splice(
        2,
        0,
        <BadgesComponent
          items={(user.blockedInGroups ?? []).map((group) => ({ id: group.id, label: group.name }))}
          badgeVariant="outline"
        ></BadgesComponent>,
      );
    }

    return defaultRow;
  });
};
