import { XUsersTable } from '@modorix-commons/components/x-users-table';

export default function Popup() {
  return (
    <>
      <h1 className="flex items-center text-xl p-2 border-b text-modorix-950 bg-white">
        <img src="/icon/48.png" className="w-7 mr-1.5" />
        Your Modorix blocked users
      </h1>
      <div className="p-4">
        <XUsersTable />
      </div>
    </>
  );
}
