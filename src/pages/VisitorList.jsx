import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import Panel from '../components/Panel';
import Notice from '../components/Notice';
import Badge from '../components/Badge';
import EmptyRow from '../components/EmptyRow';
import Field from '../components/Field';
import { visitorApi } from '../api';
import { formatDate } from '../utils/format';

export default function VisitorList() {
  const [visitors, setVisitors] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');

  useEffect(() => {
    visitorApi.list().then(setVisitors).catch((e) => setError(e.message));
  }, []);

  const roles = useMemo(() => visitors ? [...new Set(visitors.map((v) => v.role))] : [], [visitors]);
  const shown = useMemo(() => {
    if (!visitors) return [];
    const q = search.trim().toLowerCase();
    return visitors.filter((v) =>
      (role === 'all' || v.role === role) &&
      (!q || `${v.name} ${v.department} ${v.phone}`.toLowerCase().includes(q))
    );
  }, [visitors, search, role]);

  return (
    <>
      <PageHeading title="Registered visitors">
        Everyone currently active and allowed to ask for entry to your cabin.
      </PageHeading>
      <Notice kind="error">{error}</Notice>
      <Panel title="Visitor list" actions={<Link to="/visitors/new" className="btn btn-primary btn-small">Register a visitor</Link>}>
        <div className="toolbar">
          <div className="grow">
            <Field label="Search by name, department or number">
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </Field>
          </div>
          <Field label="Role">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="all">Everyone</option>
              {roles.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Department</th><th>Mobile</th><th>Fingerprint</th><th>Registered</th><th>Action</th></tr>
            </thead>
            <tbody>
              {visitors === null && !error && <EmptyRow cols={7}>Loading visitors...</EmptyRow>}
              {visitors !== null && shown.length === 0 && (
                <EmptyRow cols={7}>{visitors.length === 0 ? <>No active visitors yet. <Link to="/visitors/new">Register the first one.</Link></> : 'No visitor matches your search.'}</EmptyRow>
              )}
              {shown.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.role}</td>
                  <td>{v.department}</td>
                  <td>{v.phone}</td>
                  <td><Badge value={v.fingerprint_status} /></td>
                  <td>{formatDate(v.created_at)}</td>
                  <td className="actions"><Link to={`/visitors/${v.id}/edit`}>Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visitors && <p className="muted" style={{ marginTop: 10 }}>Showing {shown.length} of {visitors.length} active visitors.</p>}
      </Panel>
    </>
  );
}
