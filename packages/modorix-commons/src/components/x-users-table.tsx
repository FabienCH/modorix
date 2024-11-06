import { ModorixTable } from '@modorix-ui/components/modorix-table';
import { useEffect, useState } from 'react';
import { BlockReason } from '../domain/models/block-reason';
import { XUser } from '../domain/models/x-user';
import { BadeTooltipVariant } from './badges-tooltip';
import { XUserRowConfig, XUsersData, mapToXUsersData } from './x-users-table-data';

const defaultColumns: Array<{ cellElem: JSX.Element | string; className?: string }> = [
  { cellElem: 'X Username' },
  { cellElem: 'Blocked On' },
  { cellElem: 'Block Reasons' },
];

export interface OptionalColConfig {
  index: number;
  column: { cellElem: JSX.Element | string; className?: string };
  getCellElem: (xUser: XUser) => JSX.Element;
}

interface XUsersTableProps {
  BadgesComponent: ({ items, badgeVariant }: { items: BlockReason[]; badgeVariant: BadeTooltipVariant }) => JSX.Element;
  blockedUsers: XUser[];
  rowGridCols: `grid-cols-${string}`;
  optionalColsConfig?: OptionalColConfig[];
}

export const XUsersTable = ({ BadgesComponent, blockedUsers, rowGridCols, optionalColsConfig }: XUsersTableProps) => {
  const [tableState, setTableState] = useState<{
    columns: Array<{ cellElem: JSX.Element | string; className?: string }>;
    data: XUsersData;
  }>();

  useEffect(() => {
    const columns = [...defaultColumns];
    const additionalRows: XUserRowConfig[] = [];
    optionalColsConfig?.forEach((colConfig) => {
      const { index, column, getCellElem } = colConfig;
      columns.splice(index, 0, column);
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
