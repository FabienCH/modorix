import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { BlockReason } from '../models/block-reason';
import { XUser } from '../models/x-user';
import { XUsersData, mapToXUsersData } from './x-users-table-data';

const defaultColumns = ['X Username', 'Blocked On', 'Block Reasons'];

interface XUsersTableProps {
  BadgesComponent: ({ items, badgeVariant }: { items: BlockReason[]; badgeVariant: 'outline' | 'secondary' }) => JSX.Element;
  blockedUsers: XUser[];
  rowGridCols: `grid-cols-${string}`;
  optionalCol?: 'blockedInGroups';
}

export const XUsersTable = ({ BadgesComponent, blockedUsers, rowGridCols, optionalCol }: XUsersTableProps) => {
  const [blockedUsersData, setBlockedUsersData] = useState<XUsersData>([]);
  const [columns, setColumns] = useState<string[]>(defaultColumns);

  useEffect(() => {
    (async () => {
      const blockedUserData: XUsersData = mapToXUsersData({ BadgesComponent, blockedUsers, optionalCol });
      setBlockedUsersData(blockedUserData);
    })();
  }, [blockedUsers, optionalCol, BadgesComponent]);

  useEffect(() => {
    const newColumns = [...defaultColumns];
    if (optionalCol === 'blockedInGroups') {
      newColumns.splice(2, 0, 'Blocked in');
    }

    setColumns(newColumns);
  }, [optionalCol]);

  return (
    <ModorixTable
      rowClassName={`grid ${rowGridCols} align-middle`}
      columns={columns}
      data={blockedUsersData}
      emptyDataMessage="No users blocked here"
    ></ModorixTable>
  );
};
