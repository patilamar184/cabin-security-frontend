import { Link, Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SideMenu from './SideMenu';
import { RequestsProvider, useRequests } from '../context/RequestsContext';

const MENU = [
  { to: '/', label: 'Home', end: true },
  { to: '/visitors/new', label: 'Register a visitor' },
  { to: '/visitors', label: 'Registered visitors', end: true },
  { to: '/entries', label: 'Previous entries' },
  { to: '/device', label: 'Door unit' },
  { to: '/account', label: 'My account' },
];

// Shown on every page whenever someone is waiting at the door.
function WaitingNotice() {
  const { requests } = useRequests();
  if (requests.length === 0) return null;
  const n = requests.length;
  return (
    <div className="waiting-notice" role="alert">
      {n === 1 ? '1 person is waiting at your door.' : `${n} people are waiting at your door.`}{' '}
      <Link to="/">Review and respond</Link>
    </div>
  );
}

export default function OwnerLayout() {
  return (
    <RequestsProvider>
      <SiteHeader />
      <WaitingNotice />
      <div className="page-frame">
        <SideMenu title="Cabin owner" items={MENU} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <footer className="site-footer">SmartCabin Cabin Security and Visitor Register</footer>
    </RequestsProvider>
  );
}
