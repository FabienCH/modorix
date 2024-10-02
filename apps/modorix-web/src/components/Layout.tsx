import { Toaster } from '@modorix-ui/components/toaster';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex mx-auto max-w-screen-xl px-4 py-5 md:px-10 md:py-8">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
