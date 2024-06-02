import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

interface ModorixTableProps {
  columns: string[];
  data: string[][];
  emptyDataMessage: string;
}

export const ModorixTable = ({ columns, data, emptyDataMessage }: ModorixTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row) => (
              <TableRow>
                {row.map((cell) => (
                  <TableCell>{cell}</TableCell>
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
