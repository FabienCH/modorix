import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex mx-auto max-w-screen-xl px-4 py-3 md:px-10">
        <Outlet />
      </main>
    </>
  );
}
