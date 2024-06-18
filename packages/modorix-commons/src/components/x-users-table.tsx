import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { getBlockedUsers } from '../gateways/block-user-gateway';
import { BlockReason } from '../models/block-reason';

const columns = ['X Username', 'Blocked On', 'Block Reasons'];

type XUserData = [string, string, JSX.Element][];

interface XUsersTableProps {
  BlockReasonComponent: ({ blockReasons }: { blockReasons: BlockReason[] }) => JSX.Element;
  rowGridCols: `grid-cols-${string}`;
}

export const XUsersTable = ({ BlockReasonComponent, rowGridCols }: XUsersTableProps) => {
  const [blockedUsersData, setBlockedUsersData] = useState<XUserData>([]);

  useEffect(() => {
    (async () => {
      const blockedUsers = await getBlockedUsers();
      const blockedUserData: XUserData = blockedUsers.map((user) => [
        user.id,
        new Date(user.blockedAt).toLocaleDateString(),
        <BlockReasonComponent blockReasons={user.blockReasons}></BlockReasonComponent>,
      ]);
      setBlockedUsersData(blockedUserData);
    })();
  }, [BlockReasonComponent]);

  return (
    <ModorixTable
      rowClassName={`grid ${rowGridCols} align-middle`}
      columns={columns}
      data={blockedUsersData}
      emptyDataMessage="You haven't blocked any user with Modorix yet"
    ></ModorixTable>
  );
};
