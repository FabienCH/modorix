import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { BlockReason } from '../models/block-reason';
import { XUser } from '../models/x-user';
import { XUserData, xUsersData } from './x-users-table-data';

const columns = ['X Username', 'Blocked On', 'Block Reasons'];

interface XUsersTableProps {
  BlockReasonComponent: ({ blockReasons }: { blockReasons: BlockReason[] }) => JSX.Element;
  blockedUsers: XUser[];
  rowGridCols: `grid-cols-${string}`;
}

export const XUsersTable = ({ BlockReasonComponent, blockedUsers, rowGridCols }: XUsersTableProps) => {
  const [blockedUsersData, setBlockedUsersData] = useState<XUserData>([]);

  useEffect(() => {
    (async () => {
      const blockedUserData: XUserData = xUsersData({ BlockReasonComponent, blockedUsers });
      setBlockedUsersData(blockedUserData);
    })();
  }, [blockedUsers, BlockReasonComponent]);

  return (
    <ModorixTable
      rowClassName={`grid ${rowGridCols} align-middle`}
      columns={columns}
      data={blockedUsersData}
      emptyDataMessage="No users blocked here"
    ></ModorixTable>
  );
};
