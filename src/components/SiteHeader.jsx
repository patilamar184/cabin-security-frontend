import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SiteHeader() {
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();

  const who = role === 'admin' ? 'Administrator' : user ? user.name : 'Cabin owner';

  function leave() {
    signOut();
    navigate('/login');
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand">
          <div className="brand-name">SmartCabin</div>
          <div className="brand-sub">Cabin Security and Visitor Register</div>
        </div>
        {role && (
          <div className="session">
            <span>Signed in as <strong>{who}</strong></span>
            <button type="button" className="link-button" onClick={leave}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
