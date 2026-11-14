import PageHeading from '../components/PageHeading';
import Panel from '../components/Panel';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user } = useAuth();
  return (
    <>
      <PageHeading title="My account" />
      <Panel title="Account details">
        {!user ? <p className="muted">Loading...</p> : (
          <dl className="facts">
            <dt>Name</dt><dd>{user.name || user.full_name}</dd>
            <dt>Email address</dt><dd>{user.email}</dd>
            <dt>Mobile number</dt><dd>{user.phone || '-'}</dd>
            <dt>Cabin / tenant ID</dt><dd>{user.tenant_id || '-'}</dd>
            <dt>Account status</dt><dd>{user.is_active ? 'Active' : 'Inactive'}</dd>
          </dl>
        )}
      </Panel>
    </>
  );
}
