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
  const [tableState, setTableState] = useState<{ columns: string[]; data: XUsersData }>();

  useEffect(() => {
    const columns = [...defaultColumns];
    const additionalRows: XUserRowConfig[] = [];
    optionalColsConfig?.forEach((colConfig) => {
      const { index, columnLabel, getCellElem } = colConfig;
      columns.splice(index, 0, columnLabel);
      additionalRows.push({ index, getCellElem });
    });

    const blockedUserData: XUsersData = mapToXUsersData({ BadgesComponent, blockedUsers, additionalRows });
    setTableState({ columns, data: blockedUserData });
  }, [blockedUsers, optionalColsConfig, BadgesComponent]);

  return tableState ? (
    <ModorixTable
      rowClassName={`grid ${rowGridCols} align-middle`}
      columns={tableState.columns}
      data={tableState.data}
      emptyDataMessage="No users blocked here"
    ></ModorixTable>
  ) : null;
};
