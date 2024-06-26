import { BlockReason } from '../models/block-reason';
import { XUser } from '../models/x-user';

interface XUsersRowProps {
  BlockReasonComponent: ({ blockReasons }: { blockReasons: BlockReason[] }) => JSX.Element;
  blockedUsers: XUser[];
}

export type XUsersData = [string, string, JSX.Element][];

export const mapToXUsersData = ({ BlockReasonComponent, blockedUsers }: XUsersRowProps): XUsersData => {
  return blockedUsers.map((user) => [
    user.id,
    new Date(user.blockedAt).toLocaleDateString(),
    <BlockReasonComponent blockReasons={user.blockReasons}></BlockReasonComponent>,
  ]);
};
