import { Outlet, ScrollRestoration } from 'react-router-dom';

import { SidebarWithHeader } from './sidebar';

interface LayoutAppProps {
  children?: JSX.Element;
}

export function LayoutApp({ children }: LayoutAppProps) {
  return (
    <>
      <SidebarWithHeader>{children ?? <Outlet />}</SidebarWithHeader>
      <ScrollRestoration />
    </>
  );
}
