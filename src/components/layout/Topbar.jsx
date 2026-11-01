
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
  Menu,
  User,
  Moon,
  Sun
} from 'lucide-react';

import { ROUTES } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../common/Avatar';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) =>
      ref.current &&
      !ref.current.contains(e.target) &&
      setOpen(false);

    document.addEventListener('mousedown', close);

    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="topbar">
      <button
        className="menu-toggle"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <div className="user-menu" ref={ref}>
        <button
          className="user-trigger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <Avatar name={user.name} solid />

          <span className="who">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </span>

          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="user-dropdown">

            {/* Account */}
            <button
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.ACCOUNT);
              }}
            >
              <User size={16} />
              Account
            </button>

            {/* Dark / Light Mode */}
            <button
              onClick={() => {
                toggleTheme();
              }}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate(ROUTES.LOGIN, { replace: true });
              }}
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        )}
      </div>
    </header>
  );
}
