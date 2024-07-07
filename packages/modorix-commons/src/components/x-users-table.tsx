import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { BlockReason } from '../models/block-reason';
import { XUser } from '../models/x-user';
import { XUserRowConfig, XUsersData, mapToXUsersData } from './x-users-table-data';

const defaultColumns = ['X Username', 'Blocked On', 'Block Reasons'];

export interface OptionalColConfig {
  index: number;
  columnLabel: string;
  getCellElem: (xUser: XUser) => JSX.Element;
}

interface XUsersTableProps {
  BadgesComponent: ({ items, badgeVariant }: { items: BlockReason[]; badgeVariant: 'outline' | 'secondary' }) => JSX.Element;
  blockedUsers: XUser[];
  rowGridCols: `grid-cols-${string}`;
  optionalColsConfig?: OptionalColConfig[];
}

export const XUsersTable = ({ BadgesComponent, blockedUsers, rowGridCols, optionalColsConfig }: XUsersTableProps) => {
  const [blockedUsersData, setBlockedUsersData] = useState<XUsersData>([]);
  const [columns, setColumns] = useState<string[]>(defaultColumns);
  const [additionalRows, setAdditionalRows] = useState<XUserRowConfig[]>([]);

  useEffect(() => {
    (async () => {
      const blockedUserData: XUsersData = mapToXUsersData({ BadgesComponent, blockedUsers, additionalRows });
      setBlockedUsersData(blockedUserData);
    })();
  }, [blockedUsers, additionalRows, BadgesComponent]);

  useEffect(() => {
    const newColumns = [...defaultColumns];
    const newAdditionalRows: XUserRowConfig[] = [];
    optionalColsConfig?.forEach((colConfig) => {
      const { index, columnLabel, getCellElem } = colConfig;
      newColumns.splice(index, 0, columnLabel);
      newAdditionalRows.push({ index, getCellElem });
    });

    setColumns(newColumns);
    setAdditionalRows(newAdditionalRows);
  }, [optionalColsConfig]);

  return (
    <ModorixTable
      rowClassName={`grid ${rowGridCols} align-middle`}
      columns={columns}
      data={blockedUsersData}
      emptyDataMessage="No users blocked here"
    ></ModorixTable>
  );
};
