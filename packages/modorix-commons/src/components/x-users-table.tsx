import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { BlockReason } from '../models/block-reason';
import { XUser } from '../models/x-user';
import { XUsersData, mapToXUsersData } from './x-users-table-data';

const columns = ['X Username', 'Blocked On', 'Block Reasons'];

interface XUsersTableProps {
  BlockReasonComponent: ({ blockReasons }: { blockReasons: BlockReason[] }) => JSX.Element;
  blockedUsers: XUser[];
  rowGridCols: `grid-cols-${string}`;
}

export const XUsersTable = ({ BlockReasonComponent, blockedUsers, rowGridCols }: XUsersTableProps) => {
  const [blockedUsersData, setBlockedUsersData] = useState<XUsersData>([]);

  useEffect(() => {
    (async () => {
      const blockedUserData: XUsersData = mapToXUsersData({ BlockReasonComponent, blockedUsers });
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
