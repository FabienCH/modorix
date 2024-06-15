import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { BlockUserReasons } from '../components/block-user-reasons';

export default function BlocksPage() {
  return (
    <section className="w-full mx-auto max-w-screen-md">
      <h1 className="flex items-center text-xl pb-3 text-modorix-950">Your Modorix blocked users</h1>
      <XUsersTable BlockReasonComponent={BlockUserReasons} rowGridCols="grid-cols-[1fr_1fr_2fr]" />
    </section>
  );
}
