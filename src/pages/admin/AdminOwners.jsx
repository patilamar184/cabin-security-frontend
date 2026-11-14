import { useEffect, useState } from 'react';
import PageHeading from '../../components/PageHeading';
import Panel from '../../components/Panel';
import Notice from '../../components/Notice';
import Badge from '../../components/Badge';
import EmptyRow from '../../components/EmptyRow';
import { adminApi } from '../../api';

export default function AdminOwners() {
  const [owners, setOwners] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState('');

  async function load() {
    try {
      setOwners(await adminApi.owners());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(owner) {
    setError('');
    setMessage('');
    setBusyId(owner.id);
    try {
      await adminApi.setOwnerStatus(owner.id, !owner.is_active);
      setMessage(`${owner.name} has been ${owner.is_active ? 'blocked' : 'unblocked'}.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId('');
    }
  }

  return (
    <>
      <PageHeading title="Cabin owners">Block an owner to prevent their account and owner-only API access from working.</PageHeading>
      <Notice kind="error">{error}</Notice>
      <Notice kind="success">{message}</Notice>
      <Panel title="All cabin owners">
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Name</th><th>Email</th><th>Tenant ID</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {owners === null && !error && <EmptyRow cols={5}>Loading owners...</EmptyRow>}
              {owners !== null && owners.length === 0 && <EmptyRow cols={5}>No cabin owners have signed up yet.</EmptyRow>}
              {owners && owners.map((owner) => (
                <tr key={owner.id}>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.tenant_id}</td>
                  <td><Badge value={owner.is_active ? 'active' : 'blocked'} /></td>
                  <td className="actions">
                    <button type="button" className="btn btn-small" disabled={busyId === owner.id} onClick={() => toggle(owner)}>
                      {busyId === owner.id ? 'Saving...' : owner.is_active ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
