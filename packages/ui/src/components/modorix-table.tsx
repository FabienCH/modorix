import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

interface ModorixTableProps {
  columns: string[];
  data: (JSX.Element | string)[][];
  emptyDataMessage: string;
  rowClassName?: string;
}

export const ModorixTable = ({ columns, data, emptyDataMessage, rowClassName }: ModorixTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className={`${rowClassName}`}>
            {columns.map((col, idx) => (
              <TableHead
                key={`col-${idx}`}
                className={`bg-modorix-50 filter brightness-102 content-center first:rounded-tl-md last:rounded-tr-md`}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row, idx) => (
              <TableRow key={`row-${idx}`} className={`${rowClassName}`}>
                {row.map((cell, idx) => (
                  <TableCell
                    className={typeof cell === 'string' ? 'truncate table-cell ' : 'truncate flex ' + columns[idx]}
                    key={`cell-${idx}`}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={columns.length}>
                {emptyDataMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
