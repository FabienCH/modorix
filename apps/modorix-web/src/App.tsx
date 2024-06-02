import { XUsersTable } from '@modorix-commons/components/x-users-table';
import '@modorix-ui/globals.css';
import Header from './Header';

export default function App() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-screen-sm p-3">
        <h1 className="flex items-center text-xl py-3 text-modorix-950">Your Modorix blocked users</h1>
        <XUsersTable />
      </section>
    </>
  );
}
