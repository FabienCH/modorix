import { XUsersTable } from '@modorix-commons/components/x-users-table';
import '@modorix-ui/globals.css';

export default function BlocksPage() {
  return (
    <>
      <h1 className="flex items-center text-xl pb-3 text-modorix-950">Your Modorix blocked users</h1>
      <XUsersTable />
    </>
  );
}
