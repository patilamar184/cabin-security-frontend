import { Building2, Calendar, LogOut, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/format';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import DetailItem from '../../components/common/DetailItem';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      <PageHeader title={`Hello, ${user.name}`} subtitle="Manage your account and sign out from the system." />

      <div className="stack">
        <div className="card card-pad">
          <div className="cell-flex" style={{ gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <span className="avatar avatar-xl"><User size={52} /></span>
            <div style={{ flex: 1, minWidth: 260 }} className="stack">
              <div>
                <h2 style={{ fontSize: 26 }}>{user.name}</h2>
                <div style={{ marginTop: 8 }}><Badge tone="blue">{user.role}</Badge></div>
              </div>
              <div className="detail-grid">
                <DetailItem icon={User} label="Username" value={user.username} />
                <DetailItem icon={Phone} label="Phone" value={user.phone} />
                <DetailItem icon={Mail} label="Email" value={user.email} />
                <DetailItem icon={ShieldCheck} label="Role" value={user.role} />
                <DetailItem icon={Building2} label="Department" value={user.department} />
                <DetailItem icon={Calendar} label="Account Created" value={formatDateTime(user.createdAt)} />
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          <span className="alert-icon" style={{ background: '#d6e4fb', color: 'var(--primary)', width: 64, height: 64 }}><LogOut size={30} /></span>
          <div style={{ flex: 1 }}>
            <p className="alert-title">Logout from your account?</p>
            <p className="alert-text muted">You will be signed out from the Cabin Security Management System. You can log in again anytime using your credentials.</p>
          </div>
          <Button icon={LogOut} onClick={handleLogout}>Logout</Button>
        </div>

        <div className="alert alert-success">
          <span className="alert-icon"><ShieldCheck size={28} /></span>
          <div>
            <p className="alert-title">Your account is secure</p>
            <p className="alert-text">Always log out after using the system, especially on shared devices.</p>
          </div>
        </div>
      </div>
    </>
  );
}
