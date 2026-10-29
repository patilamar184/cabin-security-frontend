import { NavLink, useNavigate } from 'react-router-dom';
import { Home, UserPlus, Users, Clock, Pencil, Trash2, LogOut, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: 'Home', icon: Home, end: true },
  { to: ROUTES.REGISTRATION, label: 'Registration', icon: UserPlus },
  { to: ROUTES.VISITORS, label: 'Registered Visitors', icon: Users },
  { to: ROUTES.PREVIOUS_ENTRIES, label: 'Previous Entries', icon: Clock },
  { to: ROUTES.EDIT_REGISTRATION, label: 'Edit Registration', icon: Pencil },
  { to: ROUTES.DELETE_REGISTRATION, label: 'Delete Registration', icon: Trash2 },
];

export default function Sidebar({ open, onNavigate }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <ShieldCheck size={38} />
        <div>
          <strong>Cabin Security</strong>
          <span>Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={20} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
