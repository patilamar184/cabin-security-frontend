import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SideMenu from './SideMenu';

const MENU = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/owners', label: 'Cabin owners' },
];

export default function AdminLayout() {
  return (
    <>
      <SiteHeader />
      <div className="page-frame">
        <SideMenu title="Administration" items={MENU} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <footer className="site-footer">SmartCabin Cabin Security and Visitor Register</footer>
    </>
  );
}
